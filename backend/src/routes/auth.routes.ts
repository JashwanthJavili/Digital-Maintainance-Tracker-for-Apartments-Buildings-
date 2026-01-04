import { Router } from 'express';
import { login, register, verifyToken, getCurrentUser } from '../controllers/auth.controller';

const router = Router();

// Login
router.post('/login', login);

// Register (optional)
router.post('/register', register);

// Verify token
router.get('/verify', verifyToken);

// Get current user
router.get('/me', getCurrentUser);

export default router;
