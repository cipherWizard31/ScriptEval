'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { writeFile } from 'fs/promises'
import path from 'path'

interface Params {
  scriptId: number
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

    if (!script) return { success: false, error: 'Script not found.' };

    // 1. Overwrite the physical file with redacted version
    if (redactedPdfBase64) {
      const absolutePath = path.join(process.cwd(), 'public', script.filePath);
      const pdfBuffer = Buffer.from(redactedPdfBase64, 'base64');
      await writeFile(absolutePath, pdfBuffer);
    }

    // 2. The "Strip": Wipe identity and update status
    db.prepare(`
      UPDATE scripts
      SET status = 'CLEARED',
          authorName = NULL,
          contactInfo = NULL
      WHERE id = ?
    `).run(scriptId);

    revalidatePath('/records/dashboard');
    return { success: true };
  } catch (err) {
    console.error('redact-and-clear error:', err);
    return { success: false, error: 'Failed to save redactions.' };
  }
}