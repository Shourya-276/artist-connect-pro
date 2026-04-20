import { Router } from 'express';
import multer from 'multer';
import { uploadMedia, deleteMedia, uploadProfileImage, uploadCoverImage } from '../controllers/media.controller.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } }); // Increased from 10MB to 100MB for video support

// Portfolio Gallery
router.post('/upload', authMiddleware, upload.array('files', 15), uploadMedia);

// Profile Picture
router.post('/profile-pill', authMiddleware, upload.single('file'), uploadProfileImage);

// Cover Image
router.post('/cover-wide', authMiddleware, upload.single('file'), uploadCoverImage);

router.delete('/:id', authMiddleware, deleteMedia);

export default router;
