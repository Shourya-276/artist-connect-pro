import { Router } from 'express';
import { getMetadata } from '../controllers/metadata.controller.js';

const router = Router();

router.get('/', getMetadata);

export default router;
