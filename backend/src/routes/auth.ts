import { Router } from 'express';
import { getProfile, login } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/login', login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

export default router;
