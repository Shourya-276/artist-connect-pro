import { Router } from 'express';
import { submitReview, getArtistReviews } from '../controllers/review.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

/**
 * Submit a review
 * POST /api/reviews
 */
router.post('/', authMiddleware, submitReview);

/**
 * Get reviews for an artist
 * GET /api/reviews/artist/:artistId
 */
router.get('/artist/:artistId', getArtistReviews);

export default router;
