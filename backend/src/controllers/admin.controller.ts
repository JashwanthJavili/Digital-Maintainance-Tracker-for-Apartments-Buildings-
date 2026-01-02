import { Request, Response } from 'express';
import { db } from '../config/db';

// 1. View all maintenance requests
export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        r.id,
        r.category,
        r.title,
        r.description,
        r.status,
        r.created_at,
        u.name AS resident_name,
        t.name AS technician_name
      FROM requests r
      JOIN users u ON r.resident_id = u.id
      LEFT JOIN users t ON r.technician_id = t.id
      ORDER BY r.created_at DESC
    `);

    res.status(200).json({
      message: 'Requests retrieved successfully',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

// 2. Assign technician to request
export const assignTechnician = async (req: Request, res: Response) => {
  try {
    const { requestId, technicianId } = req.body;

    if (!requestId || !technicianId) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    await db.execute(
      `UPDATE requests 
       SET technician_id = ?, status = 'Assigned'
       WHERE id = ?`,
      [technicianId, requestId]
    );

    res.status(200).json({ message: 'Technician assigned successfully' });
  } catch (error) {
    console.error('Error assigning technician:', error);
    res.status(500).json({ error: 'Assignment failed' });
  }
};

// 3. Update request status
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { requestId, status } = req.body;

    const allowedStatus = ['Assigned', 'In-Progress', 'Resolved'];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await db.execute(
      `UPDATE requests SET status = ? WHERE id = ?`,
      [status, requestId]
    );

    res.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Status update failed' });
  }
};

// 4. Get all technicians
export const getTechnicians = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, name, email, contact_info FROM users WHERE role = 'Technician'"
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
