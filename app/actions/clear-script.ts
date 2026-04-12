// app/actions/clear-script.ts
'use server'

import db from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function clearScript(
  scriptId: string
): Promise<{ success: boolean; error?: string }> {
  try {
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
    console.error('clear-script error:', err)
    return { success: false, error: 'Failed to clear script.' }
  }
}