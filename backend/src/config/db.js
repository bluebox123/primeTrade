const mysql = require('mysql2/promise');

let pool;

async function connectDb() {
  if (pool) {
    return pool;
  }

  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'primetrade_app';

  pool = await mysql.createPool({
    host,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  console.log('Connected to MySQL');

  return pool;
}

function getDb() {
  if (!pool) {
    throw new Error('Database has not been initialised');
  }

  return pool;
}

module.exports = connectDb;
module.exports.getDb = getDb;
