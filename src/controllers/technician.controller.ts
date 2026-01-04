import { Request, Response } from "express";
import { getPool } from "../database";

/**
 * Allowed status transitions
 */
const STATUS_FLOW: Record<string, string> = {
  Assigned: "In-Progress",
  "In-Progress": "Resolved",
};

/**
 * Get all requests assigned to a technician
 * GET /api/technician/:id/requests
 */
export const getAssignedRequests = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const technicianId = req.params.id;
    const pool = getPool();

    const [rows] = await pool.query(
      "SELECT * FROM requests WHERE technician_id = ?",
      [technicianId]
    );

    return res.status(200).json({
      success: true,
      data: rows,
      message: "Assigned requests fetched successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Error fetching assigned requests",
    });
  }
};

/**
 * Update request status
 * PUT /api/technician/requests/:id/status
 */
export const updateRequestStatus = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const requestId = req.params.id;
    const { status } = req.body;
    const pool = getPool();

    const [rows]: any = await pool.query(
      "SELECT status FROM requests WHERE id = ?",
      [requestId]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Request not found",
      });
    }

    const currentStatus = rows[0].status;
    const allowedNextStatus = STATUS_FLOW[currentStatus];

    if (allowedNextStatus !== status) {
      return res.status(400).json({
        success: false,
        data: null,
        message: `Invalid status transition from ${currentStatus} to ${status}`,
      });
    }

    await pool.query("UPDATE requests SET status = ? WHERE id = ?", [
      status,
      requestId,
    ]);

    return res.status(200).json({
      success: true,
      data: null,
      message: "Status updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Error updating status",
    });
  }
};
