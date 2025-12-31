import { Request, Response } from 'express';
import { db } from '../config/db';

// 1. View all maintenance requests
export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        r.id,
        r.category,
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

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};

// 2. Assign technician to request
export const assignTechnician = async (req: Request, res: Response) => {
  const { requestId, technicianId } = req.body;

  if (!requestId || !technicianId) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    await db.query(
      `UPDATE requests 
       SET technician_id = ?, status = 'Assigned'
       WHERE id = ?`,
      [technicianId, requestId]
    );

    res.json({ message: 'Technician assigned successfully' });
  } catch {
    res.status(500).json({ message: 'Assignment failed' });
  }
};

// 3. Update request status
export const updateStatus = async (req: Request, res: Response) => {
  const { requestId, status } = req.body;

  const allowedStatus = ['Assigned', 'In-Progress', 'Resolved'];

  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    await db.query(
      `UPDATE requests SET status = ? WHERE id = ?`,
      [status, requestId]
    );

    res.json({ message: 'Status updated successfully' });
  } catch {
    res.status(500).json({ message: 'Status update failed' });
  }
};
// 4. Get all technicians
export const getTechnicians = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name FROM users WHERE role = 'Technician'"
    );
    res.json(rows);
  } catch {
    res.status(500).json({ message: 'Failed to fetch technicians' });
  }
};

