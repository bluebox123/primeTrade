const { getDb } = require('../config/db');

async function findUserByEmail(email) {
  const db = getDb();
  const [rows] = await db.query(
    'SELECT id, name, email, password_hash AS passwordHash FROM users WHERE email = ? LIMIT 1',
    [email]
  );
  return rows[0] || null;
}

async function createUser({ name, email, passwordHash }) {
  const db = getDb();
  const [result] = await db.query(
    'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, passwordHash]
  );

  const [rows] = await db.query(
    'SELECT id, name, email FROM users WHERE id = ? LIMIT 1',
    [result.insertId]
  );

  return rows[0] || null;
}

async function findUserById(id) {
  const db = getDb();
  const [rows] = await db.query(
    'SELECT id, name, email FROM users WHERE id = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

async function updateUserName(id, name) {
  const db = getDb();
  await db.query('UPDATE users SET name = ? WHERE id = ?', [name, id]);
  return findUserById(id);
}

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
  updateUserName
};
