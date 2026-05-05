const Database = require('better-sqlite3');
const db = new Database('script-eval.db');

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', JSON.stringify(tables.map(t => t.name)));

for (const { name } of tables) {
  const cols = db.pragma(`table_info(${name})`);
  console.log(`\n${name}:`, cols.map(c => `${c.name}(${c.type})`).join(', '));
  if (name === 'user') {
    const rows = db.prepare('SELECT id, name, email, role FROM user').all();
    console.log('  existing users:', JSON.stringify(rows));
  }
}
