import { Request, Response } from 'express';
import { db } from '../config/db';

// Get all requests
export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.execute(`
      SELECT 
        r.id,
        r.category,
        r.description,
        r.media,
        r.status,
        r.feedback_rating,
        r.notes,
        r.created_at,
        u.name as resident_name,
        u.contact_info as resident_contact_info,
        t.name as technician_name
      FROM requests r
      JOIN users u ON r.resident_id = u.id
      LEFT JOIN users t ON r.technician_id = t.id
      ORDER BY r.created_at DESC
    `);

    // Parse contact_info to extract room and phone
    const processedRows = rows.map((row: any) => {
      let resident_room = '';
      let resident_phone = '';
      if (row.resident_contact_info) {
        try {
          const contactInfo = JSON.parse(row.resident_contact_info);
          resident_room = contactInfo.room_number || '';
          resident_phone = contactInfo.mobile || '';
        } catch (e) {
          // Backward compatibility
          resident_room = row.resident_contact_info;
        }
      }
      return {
        ...row,
        resident_room,
        resident_phone
      };
    });

    res.status(200).json({
      message: 'Requests retrieved successfully',
      data: processedRows
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
    console.log('Create request called');
    console.log('Body:', req.body);
    console.log('File:', (req as any).file);
    
    const { resident_id, category, description } = req.body;
    const file = (req as any).file;

    // Validation: Category and description must NOT be empty
    if (!category || !description) {
      console.log('Missing category or description');
      return res.status(400).json({ 
        error: 'Category and description are required' 
      });
    }

    if (category.trim() === '' || description.trim() === '') {
      console.log('Empty category or description');
      return res.status(400).json({ 
        error: 'Category and description must not be empty' 
      });
    }

    // Validate category is one of the allowed values
    const validCategories = ['Plumbing', 'Electrical', 'Painting', 'Other'];
    if (!validCategories.includes(category)) {
      console.log('Invalid category:', category);
      return res.status(400).json({ 
        error: 'Invalid category. Must be one of: Plumbing, Electrical, Painting, Other' 
      });
    }

    // Get media filename if file was uploaded
    const mediaFilename = file ? file.filename : null;
    console.log('Media filename:', mediaFilename);

    // Media is optional, support null values
    const [result]: any = await db.execute(`
      INSERT INTO requests (resident_id, category, description, media, status, created_at)
      VALUES (?, ?, ?, ?, 'New', NOW())
    `, [resident_id, category, description, mediaFilename]);

    console.log('Request created successfully, ID:', result.insertId);
    
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

    // Status must be valid and in proper flow
    const validStatuses = ['New', 'Assigned', 'In-Progress', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: New, Assigned, In-Progress, Resolved' 
      });
    }

    // Get current status to validate flow
    const [statusRows]: any = await db.execute(
      'SELECT status FROM requests WHERE id = ?',
      [requestId]
    );

    if (statusRows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const currentStatus = statusRows[0].status;
    const statusFlow: { [key: string]: string[] } = {
      'New': ['Assigned', 'Resolved'],
      'Assigned': ['In-Progress', 'Resolved'],
      'In-Progress': ['Resolved'],
      'Resolved': [] // Cannot change from Resolved
    };

    // Validate proper flow
    if (status !== currentStatus && !statusFlow[currentStatus]?.includes(status)) {
      return res.status(400).json({ 
        error: `Cannot change status from ${currentStatus} to ${status}. Valid transitions: ${statusFlow[currentStatus]?.join(', ') || 'None'}` 
      });
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
    const { feedback_rating } = req.body;

    // Feedback rating is optional, but if provided must be in range (1-5)
    if (feedback_rating !== null && feedback_rating !== undefined) {
      if (!Number.isInteger(feedback_rating) || feedback_rating < 1 || feedback_rating > 5) {
        return res.status(400).json({ 
          error: 'Rating must be an integer between 1 and 5' 
        });
      }
    }

    // Check if request exists
    const [feedbackRows]: any = await db.execute(
      'SELECT status FROM requests WHERE id = ?',
      [requestId]
    );

    if (feedbackRows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Optional field: feedback_rating supports null values
    await db.execute(
      'UPDATE requests SET feedback_rating = ? WHERE id = ?',
      [feedback_rating || null, requestId]
    );

    res.status(200).json({
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};
