import { Request, Response } from "express";
import { getPool } from "../database";

/**
 * Get all requests assigned to a technician
 */
export const getAssignedRequests = async (req: Request, res: Response) => {
  try {
    const technicianId = req.params.id;
    const pool = getPool();

    const [rows] = await pool.query(
      "SELECT * FROM requests WHERE technician_id = ?",
      [technicianId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching assigned requests" });
  }
};

/**
 * Update request status
 */
export const updateRequestStatus = async (req: Request, res: Response) => {
  try {
    const requestId = req.params.id;
    const { status } = req.body;
    const pool = getPool();

    await pool.query("UPDATE requests SET status = ? WHERE id = ?", [
      status,
      requestId,
    ]);

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating status" });
  }
};

/**
 * Add technician notes
 */
export const addTechnicianNotes = async (req: Request, res: Response) => {
  try {
    const requestId = req.params.id;
    const { notes } = req.body;
    const pool = getPool();

    await pool.query("UPDATE requests SET technician_notes = ? WHERE id = ?", [
      notes,
      requestId,
    ]);

    res.status(200).json({ message: "Notes added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding notes" });
  }
};
