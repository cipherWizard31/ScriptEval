'use server'

import { v4 as uuidv4 } from 'uuid';
import fs from 'node:fs/promises';
import path from 'path';
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function uploadScript(formData: FormData) {
  try {
    const file = formData.get('scriptFile') as File;
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;

    if (!file || file.size === 0) {
      return { success: false, error: "Please select a PDF file." };
    }

    // 1. Setup paths
    const fileId = uuidv4();
    const extension = path.extname(file.name);
    const internalFileName = `${fileId}${extension}`;
    const vaultPath = path.join(process.cwd(), 'script-vault');
    const filePath = path.join(vaultPath, internalFileName);

    // 2. Write to disk
    await fs.mkdir(vaultPath, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // 3. Save to SQLite
    const insert = db.prepare(`
      INSERT INTO scripts (id, title, authorName, originalName, internalPath)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    insert.run(fileId, title, author, file.name, filePath);

    // Refresh the homepage data cache
    revalidatePath('/'); 
    
    return { success: true };
  } catch (error) {
    console.error("Upload Error:", error);
    return { success: false, error: "Database or File System error." };
  }
}