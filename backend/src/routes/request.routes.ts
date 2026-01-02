import express from 'express';
import * as requestController from '../controllers/request.controller';

const router = express.Router();

// Get all requests
router.get('/all', requestController.getAllRequests);

// Get request by ID
router.get('/:requestId', requestController.getRequestById);

// Get requests for a specific resident
router.get('/resident/:residentId', requestController.getResidentRequests);

// Create new request
router.post('/', requestController.createRequest);

// Update request status
router.put('/:requestId/status', requestController.updateRequestStatus);

// Submit feedback
router.put('/:requestId/feedback', requestController.submitFeedback);

export default router;
