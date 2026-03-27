import Database from 'better-sqlite3';

const db = new Database('script-eval.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS scripts (
    id TEXT PRIMARY KEY,
    title TEXT,
    authorName TEXT,
    contactInfo TEXT,
    originalName TEXT,
    internalPath TEXT,
    status TEXT DEFAULT 'PENDING_RECORDS', -- The missing column
    assignedTo TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;