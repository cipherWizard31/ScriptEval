// lib/db.ts
import Database from 'better-sqlite3';

const db = new Database('script-eval.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS scripts (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    authorName TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    contactInfo TEXT,
    internalPath TEXT,
    status TEXT DEFAULT 'PENDING_RECORDS',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Run migrations for existing databases
const existingCols = db.pragma('table_info(scripts)') as { name: string }[];
const colNames = existingCols.map(c => c.name);

if (!colNames.includes('description')) {
  db.exec(`ALTER TABLE scripts ADD COLUMN description TEXT`);
}
if (!colNames.includes('address')) {
  db.exec(`ALTER TABLE scripts ADD COLUMN address TEXT`);
}
if (!colNames.includes('phone')) {
  db.exec(`ALTER TABLE scripts ADD COLUMN phone TEXT`);
}
if (!colNames.includes('email')) {
  db.exec(`ALTER TABLE scripts ADD COLUMN email TEXT`);
}

export default db;