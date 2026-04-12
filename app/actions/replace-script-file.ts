// app/actions/replace-script-file.ts
'use server'

import db from '@/lib/db'
import { writeFile } from 'fs/promises'

export async function replaceScriptFile({
  scriptId,
  fileBase64,
}: {
  scriptId: string
  fileBase64: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const script = db
      .prepare('SELECT internalPath FROM scripts WHERE id = ?')
      .get(scriptId) as { internalPath: string } | undefined

    if (!script) return { success: false, error: 'Script not found.' }

    const buffer = Buffer.from(fileBase64, 'base64')
    await writeFile(script.internalPath, buffer)

    return { success: true }
  } catch (err) {
    console.error('replace-script-file error:', err)
    return { success: false, error: 'Failed to save replacement file.' }
  }
}