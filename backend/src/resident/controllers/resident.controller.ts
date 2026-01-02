import { Request, Response } from 'express';
import { db as pool } from '../../config/db';

// Create new maintenance request
export const createRequest = async (req: Request, res: Response) => {
  try {
    const { resident_id, category, title, description, media } = req.body;

    // Validation
    if (!category || !description) {
      return res.status(400).json({ 
        error: 'Category and description are required' 
      });
    }

    const query = `
      INSERT INTO requests (resident_id, category, title, description, media, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'New', NOW())
    `;
    
    const [result]: any = await pool.execute(query, [
      resident_id,
      category,
      title || null,
      description,
      media || null
    ]);

    res.status(201).json({
      message: 'Request created successfully',
      requestId: result.insertId
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ error: 'Failed to create request' });
  }
};

// Get request history
export const getRequestHistory = async (req: Request, res: Response) => {
  try {
    const { residentId } = req.params;
    
    const query = `
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
    `;
    
    const [rows] = await pool.execute(query, [residentId]);

    res.status(200).json({
      message: 'Requests retrieved successfully',
      data: rows
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

// Submit feedback
export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { feedback_rating, feedback_comments } = req.body;

    // Validation
    if (feedback_rating && (feedback_rating < 1 || feedback_rating > 5)) {
      return res.status(400).json({ 
        error: 'Rating must be between 1 and 5' 
      });
    }

    const query = `
      UPDATE requests 
      SET feedback_rating = ?, feedback_comments = ?
      WHERE id = ? AND status = 'Resolved'
    `;
    
    await pool.execute(query, [feedback_rating, feedback_comments || null, requestId]);

    res.status(200).json({
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};