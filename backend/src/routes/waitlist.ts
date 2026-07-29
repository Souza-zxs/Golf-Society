import { Router } from 'express';
import { validateBody } from '../middleware/validate';
import { requireAdmin } from '../middleware/requireAdmin';
import { publicFormLimiter } from '../middleware/rateLimiter';
import { createWaitlistEntrySchema, updateWaitlistStatusSchema } from '../schemas/waitlist.schema';
import {
  createWaitlistEntry,
  listWaitlistEntries,
  updateWaitlistStatus,
} from '../controllers/waitlistController';

const router = Router();

// POST /waitlist — formulário público de contato / lista de espera
router.post('/', publicFormLimiter, validateBody(createWaitlistEntrySchema), createWaitlistEntry);

// GET /waitlist — listagem administrativa
router.get('/', requireAdmin, listWaitlistEntries);

// PATCH /waitlist/:id/status — administrativo
router.patch('/:id/status', requireAdmin, validateBody(updateWaitlistStatusSchema), updateWaitlistStatus);

export default router;
