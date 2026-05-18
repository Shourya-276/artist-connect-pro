import { Router } from 'express';
import { getArtists, getArtistById, getArtistProfile, updateArtistProfile, updateArtistAvailability, updateArtist, updateArtistFlags, deleteArtist } from '../controllers/artist.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();


router.get('/', getArtists);
router.get('/me', authMiddleware, getArtistProfile);
router.get('/:id', getArtistById);
router.put('/me', authMiddleware, updateArtistProfile);
router.put('/me/availability', authMiddleware, updateArtistAvailability);
router.put('/:id', authMiddleware, updateArtist);
router.put('/:id/flags', updateArtistFlags);
router.delete('/:id', deleteArtist);

export default router;
