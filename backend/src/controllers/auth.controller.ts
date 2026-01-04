import { Request, Response } from 'express';
import { db } from '../config/db';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { user_id, password } = req.body;

    if (!user_id || !password) {
      return res.status(400).json({ error: 'User ID and password are required' });
    }

    // Find user by user_id
    const [rows]: any = await db.execute(
      'SELECT id, user_id, name, role, contact_info, password FROM users WHERE user_id = ?',
      [user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        role: user.role 
      },
      JWT_SECRET
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        user_id: user.user_id,
        name: user.name,
        role: user.role,
        contact_info: user.contact_info
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Register (optional)
export const register = async (req: Request, res: Response) => {
  try {
    const { name, role, contact_info } = req.body;

    if (!name || !role) {
      return res.status(400).json({ 
        error: 'Name and role are required' 
      });
    }

    // Insert user
    const [result]: any = await db.execute(
      'INSERT INTO users (name, role, contact_info) VALUES (?, ?, ?)',
      [name, role, contact_info || null]
    );

    res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Verify token (for middleware)
export const verifyToken = (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.status(200).json({ 
      message: 'Token is valid', 
      user: decoded 
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);

    const [rows]: any = await db.execute(
      'SELECT id, name, email, role, contact_info FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User retrieved successfully',
      user: rows[0]
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};
