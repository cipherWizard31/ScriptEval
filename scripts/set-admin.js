const Database = require('better-sqlite3');

const db = new Database('./script-eval.db');

const email = process.argv[2];

if (!email) {
  console.error("Please provide an email address. Example: node scripts/set-admin.js admin@theater.com");
  process.exit(1);
}

const result = db.prepare(`UPDATE user SET role = 'theater class' WHERE email = ?`).run(email);

if (result.changes > 0) {
  console.log(`Successfully elevated '${email}' to 'theater class' (Admin).`);
} else {
  console.log(`No user found with email '${email}'. Please ensure they have registered first.`);
}
