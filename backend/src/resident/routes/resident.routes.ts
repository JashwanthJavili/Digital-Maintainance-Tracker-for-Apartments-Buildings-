import express from 'express';
import * as residentController from '../controllers/resident.controller';

const router = express.Router();

// Submit new maintenance request
router.post('/request', residentController.createRequest);

// Get all requests for a resident
router.get('/requests/:residentId', residentController.getRequestHistory);

// Submit feedback for a request
router.post('/feedback/:requestId', residentController.submitFeedback);

export default router;