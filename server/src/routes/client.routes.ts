import { Router } from 'express';
import { getClientProfile } from '../controllers/client.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

/**
 * Get the current client profile (/me)
 */
router.get('/me', authMiddleware, getClientProfile);

export default router;
