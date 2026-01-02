import { Request, Response } from 'express';
import { db } from '../config/db';

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, name, email, role, contact_info, created_at FROM users'
    );
    res.status(200).json({
      message: 'Users retrieved successfully',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const [rows]: any = await db.execute(
      'SELECT id, name, email, role, contact_info, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'User retrieved successfully',
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Get technicians
export const getTechnicians = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, name, email, contact_info FROM users WHERE role = ?',
      ['Technician']
    );
    res.status(200).json({
      message: 'Technicians retrieved successfully',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching technicians:', error);
    res.status(500).json({ error: 'Failed to fetch technicians' });
  }
};
