'use server'

import { v4 as uuidv4 } from 'uuid';
import fs from 'node:fs/promises';
import path from 'path';
import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function uploadScript(formData: FormData) {
  // 1. Move the ID and Path generation OUTSIDE the try block for better scope
  const fileId = uuidv4();
  const vaultPath = path.join(process.cwd(), 'script-vault');
  const filePath = path.join(vaultPath, `${fileId}.pdf`);

  try {
    const file = formData.get('scriptFile') as File;
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const contact = formData.get('contact') as string;

    if (!file || file.size === 0) return { success: false, error: "No file selected." };

    // 2. File Writing
    await fs.mkdir(vaultPath, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    // 3. Database Insertion
    const insert = db.prepare(`
      INSERT INTO scripts (id, title, authorName, contactInfo, internalPath)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    insert.run(fileId, title, author, contact, filePath);

    // 4. Force a cache clear so the dashboard updates
    revalidatePath('/');
    revalidatePath('/records/dashboard');

    // CRITICAL: Explicitly return success: true
    return { success: true };

  } catch (error: any) {
    // Log the ACTUAL error to your terminal so you can see it
    console.error("DEBUG UPLOAD ERROR:", error.message);

    // If the error is just "Unique Constraint" or something minor, 
    // but the file exists, you might still want to return success.
    // For now, let's catch why it thinks it failed:
    return { 
      success: false, 
      error: error.message || "Server processed but returned an error state." 
    };
  }
}