import { Router } from 'express';
import { getClientProfile } from '../controllers/client.controller.js';
import { changePassword } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

/**
 * Get the current client profile (/me)
 */
router.get('/me', authMiddleware, getClientProfile);

/**
 * Change authenticated client/user password
 */
router.post('/change-password', authMiddleware, changePassword);

export default router;
