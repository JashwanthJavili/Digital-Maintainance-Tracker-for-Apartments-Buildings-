import { Request, Response } from 'express';
import { db } from '../config/db';

// Get all requests
export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        r.id,
        r.category,
        r.title,
        r.description,
        r.media,
        r.status,
        r.feedback_rating,
        r.created_at,
        u.name as resident_name,
        t.name as technician_name
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

// Get request by ID
export const getRequestById = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const [rows]: any = await db.execute(`
      SELECT 
        r.*,
        u.name as resident_name,
        t.name as technician_name
      FROM requests r
      JOIN users u ON r.resident_id = u.id
      LEFT JOIN users t ON r.technician_id = t.id
      WHERE r.id = ?
    `, [requestId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.status(200).json({
      message: 'Request retrieved successfully',
      data: rows[0]
    });
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
};

// Get requests for a resident
export const getResidentRequests = async (req: Request, res: Response) => {
  try {
    const { residentId } = req.params;
    const [rows] = await db.execute(`
      SELECT 
        r.id,
        r.category,
        r.title,
        r.description,
        r.media,
        r.status,
        r.feedback_rating,
        r.created_at,
        u.name as technician_name
      FROM requests r
      LEFT JOIN users u ON r.technician_id = u.id
      WHERE r.resident_id = ?
      ORDER BY r.created_at DESC
    `, [residentId]);

    res.status(200).json({
      message: 'Requests retrieved successfully',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

// Create request
export const createRequest = async (req: Request, res: Response) => {
  try {
    const { resident_id, category, title, description, media } = req.body;

    if (!category || !description) {
      return res.status(400).json({ 
        error: 'Category and description are required' 
      });
    }

    const [result]: any = await db.execute(`
      INSERT INTO requests (resident_id, category, title, description, media, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'New', NOW())
    `, [resident_id, category, title, description, media || null]);

    res.status(201).json({
      message: 'Request created successfully',
      requestId: result.insertId
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
};

// Update request status
export const updateRequestStatus = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const validStatuses = ['New', 'Assigned', 'In-Progress', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    await db.execute(
      'UPDATE requests SET status = ? WHERE id = ?',
      [status, requestId]
    );

    res.status(200).json({
      message: 'Request status updated successfully'
    });
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ error: 'Failed to update request' });
  }
};

// Submit feedback
export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { feedback_rating, feedback_comments } = req.body;

    if (feedback_rating && (feedback_rating < 1 || feedback_rating > 5)) {
      return res.status(400).json({ 
        error: 'Rating must be between 1 and 5' 
      });
    }

    await db.execute(
      'UPDATE requests SET feedback_rating = ?, feedback_comments = ? WHERE id = ?',
      [feedback_rating, feedback_comments || null, requestId]
    );

    res.status(200).json({
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};
