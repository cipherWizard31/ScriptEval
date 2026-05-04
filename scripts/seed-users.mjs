/**
 * scripts/seed-users.mjs
 * 
 * Creates dummy test accounts for each role and one admin account.
 * Wipes all existing users first.
 * 
 * Run with: node scripts/seed-users.mjs
 */

import Database from 'better-sqlite3';
import { randomBytes, scrypt } from 'node:crypto';
import { randomUUID } from 'node:crypto';

const db = new Database('script-eval.db');

// ── Same params better-auth uses internally ──────────────────────────────────
function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString('hex');
    scrypt(
      password.normalize('NFKC'),
      salt,
      64,
      { N: 16384, r: 16, p: 1, maxmem: 128 * 16384 * 16 * 2 },
      (err, key) => {
        if (err) reject(err);
        else resolve(`${salt}:${key.toString('hex')}`);
      }
    );
  });
}

// ── Accounts to create ───────────────────────────────────────────────────────
const ACCOUNTS = [
  { name: 'Admin',          email: 'admin@theater.com',     role: 'theater class', password: 'dummypass' },
  { name: 'Records Office', email: 'records@theater.com',   role: 'record office', password: 'dummypass' },
  { name: 'Evaluator',      email: 'evaluator@theater.com', role: 'evaluator',     password: 'dummypass' },
];

async function main() {
  // 1. Wipe all existing users + linked sessions/accounts
  console.log('🗑  Deleting all existing users, sessions, and accounts…');
  db.exec(`DELETE FROM session`);
  db.exec(`DELETE FROM account`);
  db.exec(`DELETE FROM user`);

  const insertUser = db.prepare(`
    INSERT INTO user (id, name, email, emailVerified, createdAt, updatedAt, role)
    VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)
  `);

  const insertAccount = db.prepare(`
    INSERT INTO account (id, accountId, providerId, userId, password, createdAt, updatedAt)
    VALUES (?, ?, 'credential', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `);

  for (const acct of ACCOUNTS) {
    const userId    = randomUUID().replace(/-/g, '');
    const accountId = randomUUID().replace(/-/g, '');
    const hash      = await hashPassword(acct.password);

    insertUser.run(userId, acct.name, acct.email, acct.role);
    insertAccount.run(accountId, userId, userId, hash);

    console.log(`✅  Created [${acct.role.padEnd(12)}]  ${acct.email}  /  ${acct.password}`);
  }

  console.log('\n🎉  Done! Test credentials:');
  console.log('────────────────────────────────────────────────────');
  for (const a of ACCOUNTS) {
    console.log(`  ${a.role.padEnd(14)}  ${a.email}  →  ${a.password}`);
  }
  console.log('────────────────────────────────────────────────────');
}

main().catch(err => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
