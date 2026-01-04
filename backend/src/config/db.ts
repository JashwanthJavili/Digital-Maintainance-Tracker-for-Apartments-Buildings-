import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from project root
dotenv.config({ path: path.join(__dirname, '..', '..', '..', '.env') });

export const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'maintainance_tracker',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
