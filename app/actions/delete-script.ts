// app/actions/delete-script.ts
'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'
import fs from 'node:fs/promises'

export async function deleteScript(
  scriptId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const script = db
      .prepare('SELECT internalPath FROM scripts WHERE id = ?')
      .get(scriptId) as { internalPath: string } | undefined

    if (!script) return { success: false, error: 'Script not found.' }

    // Mark as DELETED in DB and record timestamp
    db.prepare(
      `UPDATE scripts
       SET status = 'DELETED',
           deletedAt = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).run(scriptId)

    // Delete the physical file from the vault
    if (script.internalPath) {
      await fs.unlink(script.internalPath).catch(() => {
        // File may already be gone — not a fatal error
      })
    }

    revalidatePath('/records/dashboard')
    revalidatePath('/records/deleted')

    return { success: true }
  } catch (err) {
    console.error('delete-script error:', err)
    return { success: false, error: 'Failed to delete script.' }
  }
}
