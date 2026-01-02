import express from 'express';
import * as userController from '../controllers/user.controller';

const router = express.Router();

// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:userId', userController.getUserById);

// Get technicians
router.get('/technicians/list', userController.getTechnicians);

export default router;
