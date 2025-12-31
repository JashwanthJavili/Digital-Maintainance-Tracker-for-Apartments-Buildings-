import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Ranjani@123',
  database: 'digital_maintenance_tracker'
});
