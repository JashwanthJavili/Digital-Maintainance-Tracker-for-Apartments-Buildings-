import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Sandeep@2357',
  database: process.env.DB_NAME || 'digital_maintenance_tracker',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
