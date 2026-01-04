-- Create database
CREATE DATABASE IF NOT EXISTS maintainance_tracker;
USE maintainance_tracker;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  role ENUM('Resident', 'Technician', 'Admin') NOT NULL,
  contact_info VARCHAR(150),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Requests Table
CREATE TABLE IF NOT EXISTS requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  resident_id INT NOT NULL,
  technician_id INT,
  category ENUM('Plumbing', 'Electrical', 'Painting', 'Other') NOT NULL,
  description TEXT NOT NULL,
  media VARCHAR(255),
  status ENUM('New', 'Assigned', 'In-Progress', 'Resolved') DEFAULT 'New',
  feedback_rating INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (resident_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert sample data
INSERT INTO users (name, role, contact_info) VALUES
('John Resident', 'Resident', '555-0001'),
('Jane Resident', 'Resident', '555-0002'),
('Mike Technician', 'Technician', '555-1001'),
('Sarah Technician', 'Technician', '555-1002'),
('Admin User', 'Admin', '555-9999');

-- Insert sample requests
INSERT INTO requests (resident_id, category, description, status) VALUES
(1, 'Plumbing', 'Kitchen faucet is leaking water continuously', 'New'),
(1, 'Electrical', 'Bedroom light is flickering on and off', 'Assigned'),
(2, 'Painting', 'Living room wall needs repainting', 'New');
