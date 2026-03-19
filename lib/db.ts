// lib/db.ts
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'prisma');
const dbPath = path.join(dbDir, 'dev.db');

// 1. Ensure the directory exists first
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// 2. Now open the database
const db = new Database(dbPath);

// 3. Create the table
db.exec(`
  CREATE TABLE IF NOT EXISTS scripts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    authorName TEXT NOT NULL,
    originalName TEXT NOT NULL,
    internalPath TEXT NOT NULL,
    uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;