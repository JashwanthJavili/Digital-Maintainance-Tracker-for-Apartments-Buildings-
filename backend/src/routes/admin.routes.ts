import { Router } from 'express';
import {
  getAllRequests,
  assignTechnician,
  updateStatus,
  getTechnicians
} from '../controllers/admin.controller';

const router = Router();

router.get('/technicians', getTechnicians);
router.get('/requests', getAllRequests);
router.put('/assign', assignTechnician);
router.put('/status', updateStatus);

export default router;
