import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Next.js 15 requires awaiting params
  const { id } = await params;

  const script = db.prepare("SELECT filePath FROM scripts WHERE id = ?").get(id) as { filePath: string } | undefined;

  if (!script) return new NextResponse("Script not found", { status: 404 });

  // Map the DB path to the physical public folder
  const fullPath = path.join(process.cwd(), 'public', script.filePath);

  if (!fs.existsSync(fullPath)) {
    return new NextResponse("File not found on server", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(fullPath);

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline',
    },
  });
}