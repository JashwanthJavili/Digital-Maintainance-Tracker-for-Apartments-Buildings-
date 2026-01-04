import { Router } from 'express';
import {
  getAssignedRequests,
  updateRequestStatus,
  getRequestById,
  uploadMedia
} from '../controllers/technician.controller';

const router = Router();

// Get all requests assigned to a technician
router.get('/requests/:technicianId', getAssignedRequests);

// Get specific request details
router.get('/request/:requestId', getRequestById);

// Update request status
router.put('/request/:requestId/status', updateRequestStatus);

// Upload media for a request (optional)
router.post('/request/:requestId/media', uploadMedia);

export default router;
