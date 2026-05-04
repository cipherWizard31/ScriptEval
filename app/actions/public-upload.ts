'use server'

import { v4 as uuidv4 } from 'uuid';
import fs from 'node:fs/promises';
import path from 'path';
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function uploadScript(formData: FormData) {
  const fileId = uuidv4();
  const vaultPath = path.join(process.cwd(), 'script-vault');
  const filePath = path.join(vaultPath, `${fileId}.pdf`);

  try {
    const file        = formData.get('scriptFile') as File;
    const title       = formData.get('title') as string;
    const description = formData.get('description') as string;
    const author      = formData.get('author') as string;
    const address     = formData.get('address') as string;
    const phone       = formData.get('phone') as string;
    const email       = formData.get('email') as string;

    if (!file || file.size === 0) return { success: false, error: "No file selected." };

    // File writing
    await fs.mkdir(vaultPath, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // Database insertion
    const insert = db.prepare(`
      INSERT INTO scripts (id, title, description, authorName, address, phone, email, contactInfo, internalPath)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // contactInfo is kept as a combined legacy field for backwards compatibility
    const contactInfo = [phone, email].filter(Boolean).join(' | ');
    insert.run(fileId, title, description, author, address, phone, email, contactInfo, filePath);

    revalidatePath('/');
    revalidatePath('/records/dashboard');

    return { success: true };

  } catch (error: any) {
    console.error("DEBUG UPLOAD ERROR:", error.message);
    return {
      success: false,
      error: error.message || "Server processed but returned an error state.",
    };
  }
}