import { createPool } from 'mysql2/promise';
import 'dotenv/config';

const pool = createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tourism_db',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
});

console.log('✅ MySQL connection pool ready (ESM)');

export const execute = (sql, params) => pool.execute(sql, params);
export default pool;