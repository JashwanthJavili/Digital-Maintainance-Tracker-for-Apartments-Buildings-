import express from 'express';
import * as userController from '../controllers/user.controller';

const router = express.Router();

// Get all users
router.get('/', userController.getAllUsers);

// Generate user ID
router.get('/generate-id', userController.generateUserId);

// Create new user
router.post('/', userController.createUser);

// Change password
router.post('/change-password', userController.changePassword);

// Get user by ID
router.get('/:userId', userController.getUserById);

// Get technicians
router.get('/technicians/list', userController.getTechnicians);

export default router;
