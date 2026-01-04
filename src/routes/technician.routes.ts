import { Router } from "express";
import {
  getAssignedRequests,
  updateRequestStatus,
} from "../controllers/technician.controller";

const router = Router();

// View assigned requests
router.get("/:id/requests", getAssignedRequests);

// Update request status
router.put("/requests/:id/status", updateRequestStatus);

export default router;
