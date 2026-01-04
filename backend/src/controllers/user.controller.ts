import { Request, Response } from 'express';
import { db } from '../config/db';
import bcrypt from 'bcrypt';

// Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, user_id, name, role, contact_info, created_at FROM users ORDER BY created_at DESC'
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

// Generate user ID based on role, mobile number, and room number (for residents)
export const generateUserId = async (req: Request, res: Response) => {
  try {
    const { role, mobile, roomNumber } = req.query;
    
    if (!mobile || mobile.toString().length < 3) {
      return res.status(400).json({ error: 'Valid mobile number required (at least last 3 digits)' });
    }
    
    let rolePrefix = '';
    if (role === 'Resident') rolePrefix = 'R';
    else if (role === 'Technician') rolePrefix = 'T';
    else if (role === 'Admin') rolePrefix = 'A';
    else return res.status(400).json({ error: 'Invalid role' });
    
    // Get last 3 digits of mobile
    const mobileStr = mobile.toString();
    const lastThreeDigits = mobileStr.slice(-3);
    
    let newUserId = '';
    
    if (role === 'Resident') {
      // For residents: SSN[R][RoomNumber][Last3Digits]
      if (!roomNumber) {
        return res.status(400).json({ error: 'Room number required for residents' });
      }
      newUserId = `SSN${rolePrefix}${roomNumber}${lastThreeDigits}`;
    } else {
      // For technicians/admins: SSN[T/A][Last4Digits] for more uniqueness
      const lastFourDigits = mobileStr.slice(-4);
      newUserId = `SSN${rolePrefix}${lastFourDigits}`;
    }
    
    // Check if this ID already exists
    const [existing]: any = await db.execute(
      'SELECT id FROM users WHERE user_id = ?',
      [newUserId]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ 
        error: 'User ID already exists. This combination is taken.',
        userId: newUserId
      });
    }
    
    res.status(200).json({
      message: 'User ID generated',
      userId: newUserId
    });
  } catch (error) {
    console.error('Error generating user ID:', error);
    res.status(500).json({ error: 'Failed to generate user ID' });
  }
};

// Create new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { user_id, name, role, contact_info, additionalInfo } = req.body;
    
    console.log('Creating user:', { user_id, name, role, contact_info, additionalInfo });
    
    // Validation
    if (!user_id || !name || !role) {
      return res.status(400).json({ error: 'User ID, name, and role are required' });
    }
    
    // Check if user_id already exists
    const [existing]: any = await db.execute('SELECT id FROM users WHERE user_id = ?', [user_id]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User ID already exists' });
    }
    
    // Hash the password (user_id is default password)
    const hashedPassword = await bcrypt.hash(user_id, 10);
    
    // Store additional info in contact_info field as JSON
    let storedContactInfo = contact_info || '';
    if (additionalInfo) {
      storedContactInfo = JSON.stringify(additionalInfo);
    }
    
    const [result]: any = await db.execute(
      'INSERT INTO users (user_id, name, role, contact_info, password, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [user_id, name, role, storedContactInfo, hashedPassword]
    );
    
    console.log('User created successfully, ID:', result.insertId);
    
    res.status(201).json({
      message: 'User created successfully',
      userId: result.insertId,
      user_id: user_id
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const [rows]: any = await db.execute(
      'SELECT id, name, role, contact_info, created_at FROM users WHERE id = ?',
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
    const [rows]: any = await db.execute(
      `SELECT u.id, u.name, u.contact_info,
       (SELECT COUNT(*) FROM requests r 
        WHERE r.technician_id = u.id 
        AND r.status IN ('Assigned', 'In-Progress')) as active_requests
       FROM users u WHERE u.role = ?`,
      ['Technician']
    );
    
    // Parse contact_info to extract specialization
    const processedRows = rows.map((row: any) => {
      let specialization = '';
      if (row.contact_info) {
        try {
          const contactInfo = JSON.parse(row.contact_info);
          specialization = contactInfo.specialization || 'General';
        } catch (e) {
          specialization = 'General';
        }
      }
      return {
        id: row.id,
        name: row.name,
        specialization,
        active_requests: row.active_requests
      };
    });
    
    res.status(200).json({
      message: 'Technicians retrieved successfully',
      data: processedRows
    });
  } catch (error) {
    console.error('Error fetching technicians:', error);
    res.status(500).json({ error: 'Failed to fetch technicians' });
  }
};

// Change password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ error: 'User ID, current password, and new password are required' });
    }
    
    // Get user with password
    const [rows]: any = await db.execute(
      'SELECT id, password FROM users WHERE id = ?',
      [userId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = rows[0];
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await db.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, userId]
    );
    
    res.status(200).json({
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};
