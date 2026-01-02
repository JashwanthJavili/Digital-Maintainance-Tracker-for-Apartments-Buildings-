import mysql from 'mysql2/promise';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function setupDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Sandeep@2357',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    // Create database first
    console.log('Creating database...');
    await connection.query('CREATE DATABASE IF NOT EXISTS digital_maintenance_tracker');
    
    // Select database
    await connection.query('USE digital_maintenance_tracker');
    
    // Create users table
    console.log('Creating users table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        role ENUM('Resident', 'Technician', 'Admin') NOT NULL,
        contact_info VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create requests table
    console.log('Creating requests table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS requests (
        id INT PRIMARY KEY AUTO_INCREMENT,
        resident_id INT NOT NULL,
        technician_id INT,
        category ENUM('Plumbing', 'Electrical', 'Painting', 'Other') NOT NULL,
        title VARCHAR(255),
        description TEXT NOT NULL,
        media VARCHAR(500),
        status ENUM('New', 'Assigned', 'In-Progress', 'Resolved') DEFAULT 'New',
        feedback_rating INT,
        feedback_comments TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (resident_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Insert sample data
    console.log('Inserting sample users...');
    await connection.query(`
      INSERT IGNORE INTO users (name, email, password, role, contact_info) VALUES
      ('John Resident', 'resident1@example.com', 'password123', 'Resident', '555-0001'),
      ('Jane Resident', 'resident2@example.com', 'password123', 'Resident', '555-0002'),
      ('Mike Technician', 'tech1@example.com', 'password123', 'Technician', '555-1001'),
      ('Sarah Technician', 'tech2@example.com', 'password123', 'Technician', '555-1002'),
      ('Admin User', 'admin@example.com', 'password123', 'Admin', '555-9999')
    `);

    console.log('Inserting sample requests...');
    await connection.query(`
      INSERT IGNORE INTO requests (resident_id, category, title, description, status) VALUES
      (1, 'Plumbing', 'Leaking Faucet', 'Kitchen faucet is leaking water continuously', 'New'),
      (1, 'Electrical', 'Flickering Light', 'Bedroom light is flickering on and off', 'Assigned'),
      (2, 'Painting', 'Wall Paint Needed', 'Living room wall needs repainting', 'New')
    `);
    
    console.log('✅ Database setup completed successfully!');
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    await connection.end();
  }
}

setupDatabase();
