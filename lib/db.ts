// lib/db.ts
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'prisma');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new Database(path.join(dbDir, 'dev.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS scripts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    authorName TEXT NOT NULL,
    contactInfo TEXT NOT NULL, 
    originalName TEXT NOT NULL,
    internalPath TEXT NOT NULL,
    status TEXT DEFAULT 'PENDING_RECORDS', -- PENDING_RECORDS, READY_FOR_ADMIN, ASSIGNED, EVALUATED
    assignedEvaluator TEXT,
    uploadedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scriptId TEXT UNIQUE,
    score INTEGER,
    comments TEXT,
    submittedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(scriptId) REFERENCES scripts(id)
  );
`);

export default db;