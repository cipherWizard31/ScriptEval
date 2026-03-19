// app/actions/upload-script.ts
'use server'

import { v4 as uuidv4 } from 'uuid';
import fs from 'node:fs/promises';
import path from 'path';
import db from '@/lib/db'; // Import our new simple DB
import { redirect } from 'next/navigation';

export async function uploadScript(formData: FormData) {
  const file = formData.get('scriptFile') as File;
  const title = formData.get('title') as string;
  const author = formData.get('author') as string;

  if (!file || file.size === 0) throw new Error("File is empty");

  // 1. Generate unique ID and file paths
  const fileId = uuidv4();
  const extension = path.extname(file.name);
  const internalFileName = `${fileId}${extension}`;
  const vaultPath = path.join(process.cwd(), 'script-vault');
  const filePath = path.join(vaultPath, internalFileName);

  // 2. Ensure vault directory exists
  await fs.mkdir(vaultPath, { recursive: true });

  // 3. Write file to disk
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  // 4. Save metadata to SQLite using a prepared statement (SQL Injection safe)
  const insert = db.prepare(`
    INSERT INTO scripts (id, title, authorName, originalName, internalPath)
    VALUES (?, ?, ?, ?, ?)
  `);

  insert.run(fileId, title, author, file.name, filePath);

  redirect('/admin/upload?success=true');
}