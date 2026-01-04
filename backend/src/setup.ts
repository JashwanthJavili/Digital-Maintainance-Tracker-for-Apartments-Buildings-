import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function setupDatabase() {
  try {
    // Connect without database first to create it
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    console.log('Connected to MySQL');

    // Read the init SQL file
    const sqlPath = path.join(__dirname, 'database', 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // Execute each statement separately
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.execute(statement);
          console.log('✓ Executed:', statement.substring(0, 50) + '...');
        } catch (error) {
          console.log('Note:', error);
        }
      }
    }

    console.log('✓ Database setup completed successfully!');
    await connection.end();
  } catch (error) {
    console.error('✗ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
