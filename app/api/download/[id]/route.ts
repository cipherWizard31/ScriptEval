// src/app/api/download/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import fs from 'node:fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 1. Fetch metadata from SQLite using the UUID
  const script = await prisma.script.findUnique({
    where: { id: params.id },
  });

  if (!script) {
    return new NextResponse('Script not found', { status: 404 });
  }

  // 2. Read the file from the vault
  // Using the absolute path stored in 'internalPath'
  if (!fs.existsSync(script.internalPath)) {
    return new NextResponse('File missing on server', { status: 404 });
  }

  const fileBuffer = fs.readFileSync(script.internalPath);

  // 3. Return the file as a PDF stream
  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      // This forces the browser to show the original name, not the UUID
      'Content-Disposition': `attachment; filename="${script.originalName}"`,
    },
  });
}