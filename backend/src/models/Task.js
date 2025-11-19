const { getDb } = require('../config/db');

function mapRowToTask(row) {
  if (!row) return null;

  return {
    _id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    dueDate: row.due_date,
    owner: row.owner_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getTasksForUser(userId, filters) {
  const db = getDb();
  const params = [userId];
  let sql =
    'SELECT id, title, description, status, due_date, owner_id, created_at, updated_at FROM tasks WHERE owner_id = ?';

  if (filters.status) {
    sql += ' AND status = ?';
    params.push(filters.status);
  }

  if (filters.search) {
    sql += ' AND (title LIKE ? OR description LIKE ?)';
    const pattern = `%${filters.search}%`;
    params.push(pattern, pattern);
  }

  sql += ' ORDER BY created_at DESC';

  const [rows] = await db.query(sql, params);
  return rows.map(mapRowToTask);
}

async function createTaskForUser(userId, data) {
  const db = getDb();

  const title = data.title;
  const description = data.description || '';
  const status = data.status || 'pending';
  const dueDate = data.dueDate || null;

  const [result] = await db.query(
    'INSERT INTO tasks (title, description, status, due_date, owner_id) VALUES (?, ?, ?, ?, ?)',
    [title, description, status, dueDate, userId]
  );

  const [rows] = await db.query(
    'SELECT id, title, description, status, due_date, owner_id, created_at, updated_at FROM tasks WHERE id = ? LIMIT 1',
    [result.insertId]
  );

  return mapRowToTask(rows[0]);
}

async function getTaskForUser(userId, taskId) {
  const db = getDb();
  const [rows] = await db.query(
    'SELECT id, title, description, status, due_date, owner_id, created_at, updated_at FROM tasks WHERE owner_id = ? AND id = ? LIMIT 1',
    [userId, taskId]
  );

  return mapRowToTask(rows[0]);
}

async function updateTaskForUser(userId, taskId, updates) {
  const db = getDb();

  const fields = [];
  const params = [];

  if (updates.title !== undefined) {
    fields.push('title = ?');
    params.push(updates.title);
  }
  if (updates.description !== undefined) {
    fields.push('description = ?');
    params.push(updates.description);
  }
  if (updates.status !== undefined) {
    fields.push('status = ?');
    params.push(updates.status);
  }
  if (updates.dueDate !== undefined) {
    fields.push('due_date = ?');
    params.push(updates.dueDate);
  }

  if (fields.length === 0) {
    return getTaskForUser(userId, taskId);
  }

  params.push(userId, taskId);

  await db.query(
    `UPDATE tasks SET ${fields.join(', ')} WHERE owner_id = ? AND id = ?`,
    params
  );

  return getTaskForUser(userId, taskId);
}

async function deleteTaskForUser(userId, taskId) {
  const db = getDb();
  const [result] = await db.query(
    'DELETE FROM tasks WHERE owner_id = ? AND id = ?',
    [userId, taskId]
  );

  return result.affectedRows > 0;
}

module.exports = {
  getTasksForUser,
  createTaskForUser,
  updateTaskForUser,
  deleteTaskForUser,
};
