import { Request, Response } from 'express';
import { db } from '../config/db';

// Get assigned requests for technician
export const getAssignedRequests = async (req: Request, res: Response) => {
  try {
    const { technicianId } = req.params;

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
        u.contact_info as resident_contact_info
      FROM requests r
      JOIN users u ON r.resident_id = u.id
      WHERE r.technician_id = ?
      ORDER BY 
        CASE 
          WHEN r.status = 'Assigned' THEN 1
          WHEN r.status = 'In-Progress' THEN 2
          WHEN r.status = 'Resolved' THEN 3
          ELSE 4
        END,
        r.created_at DESC
    `, [technicianId]);

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
      message: 'Assigned requests retrieved successfully',
      data: processedRows
    });
  } catch (error) {
    console.error('Error fetching assigned requests:', error);
    res.status(500).json({ error: 'Failed to fetch assigned requests' });
  }
};

// Update request status by technician
export const updateRequestStatus = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ['Assigned', 'In-Progress', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: Assigned, In-Progress, Resolved' 
      });
    }

    // Update status
    await db.execute(
      'UPDATE requests SET status = ? WHERE id = ?',
      [status, requestId]
    );

    res.status(200).json({
      message: 'Request status updated successfully',
      status: status
    });
  } catch (error) {
    console.error('Error updating request status:', error);
    res.status(500).json({ error: 'Failed to update request status' });
  }
};

// Get request details by ID
export const getRequestById = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;

    const [rows]: any = await db.execute(`
      SELECT 
        r.*,
        u.name as resident_name,
        u.contact_info as resident_contact
      FROM requests r
      JOIN users u ON r.resident_id = u.id
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

// Upload media (optional - for future implementation)
export const uploadMedia = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params;
    const { mediaUrl } = req.body;

    if (!mediaUrl) {
      return res.status(400).json({ error: 'Media URL is required' });
    }

    await db.execute(
      'UPDATE requests SET media = ? WHERE id = ?',
      [mediaUrl, requestId]
    );

    res.status(200).json({
      message: 'Media uploaded successfully',
      mediaUrl: mediaUrl
    });
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ error: 'Failed to upload media' });
  }
};
