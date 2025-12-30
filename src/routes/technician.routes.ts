import { Router } from "express";
import {
  getAssignedRequests,
  updateRequestStatus,
  addTechnicianNotes,
} from "../controllers/technician.controller";

const router = Router();

// View assigned requests
router.get("/:id/requests", getAssignedRequests);

// Update request status
router.put("/requests/:id/status", updateRequestStatus);

// Add technician notes
router.put("/requests/:id/notes", addTechnicianNotes);

export default router;
