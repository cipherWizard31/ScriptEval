// app/api/scripts/[id]/file/route.ts
import db from '@/lib/db'
import { readFile } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const script = db
    .prepare(`SELECT internalPath FROM scripts WHERE id = ?`)
    .get(id) as { internalPath: string } | undefined

  if (!script) {
    return new NextResponse('Script not found', { status: 404 })
  }

  try {
    const fileBuffer = await readFile(script.internalPath)

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        // Prevent caching so a freshly redacted file is always served
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return new NextResponse('File not found on disk', { status: 404 })
  }
}