// app/actions/redact-and-clear.ts
'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { writeFile } from 'fs/promises'
import path from 'path'

interface Params {
  scriptId: number
  // null = skip PDF replacement, just clear the DB record
  redactedPdfBase64: string | null
}

export async function applyRedactionsAndClear({
  scriptId,
  redactedPdfBase64,
}: Params): Promise<{ success: boolean; error?: string }> {
  try {
    const script = db
      .prepare('SELECT filePath FROM scripts WHERE id = ?')
      .get(scriptId) as { filePath: string } | undefined

    if (!script) {
      return { success: false, error: 'Script not found.' }
    }

    // Only overwrite the file if a redacted PDF was provided
    if (redactedPdfBase64) {
      const absolutePath = path.join(process.cwd(), 'public', script.filePath)
      const pdfBuffer = Buffer.from(redactedPdfBase64, 'base64')
      await writeFile(absolutePath, pdfBuffer)
    }

    // Strip identity and mark as CLEARED regardless
    db.prepare(
      `UPDATE scripts
       SET status = 'CLEARED',
           authorName = NULL,
           contactInfo = NULL
       WHERE id = ?`
    ).run(scriptId)

    revalidatePath('/records/dashboard')
    revalidatePath('/records/cleared')

    return { success: true }
  } catch (err) {
    console.error('redact-and-clear error:', err)
    return { success: false, error: 'Server error while saving the redacted PDF.' }
  }
}