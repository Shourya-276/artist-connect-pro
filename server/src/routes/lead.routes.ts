import { Router } from 'express';
import { createLead, getAllLeads } from '../controllers/lead.controller.js';

const router = Router();

router.post('/', createLead);
router.get('/', getAllLeads);

export default router;
