// lib/db.ts
import Database from 'better-sqlite3';

const db = new Database('script-eval.db');

// We use internalPath here to match your current uploadScript action
db.exec(`
  CREATE TABLE IF NOT EXISTS scripts (
    id TEXT PRIMARY KEY,
    title TEXT,
    authorName TEXT,
    contactInfo TEXT,
    internalPath TEXT, 
    status TEXT DEFAULT 'PENDING_RECORDS',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;