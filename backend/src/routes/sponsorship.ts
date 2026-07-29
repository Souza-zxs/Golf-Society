import { Router } from 'express';
import { validateBody } from '../middleware/validate';
import { requireAdmin } from '../middleware/requireAdmin';
import { publicFormLimiter } from '../middleware/rateLimiter';
import {
  createSponsorshipApplicationSchema,
  updateSponsorshipStatusSchema,
} from '../schemas/sponsorship.schema';
import {
  createSponsorshipApplication,
  listSponsorshipApplications,
  updateSponsorshipStatus,
} from '../controllers/sponsorshipController';

const router = Router();

// POST /sponsorships — formulário público "Seja um Patrocinador"
router.post(
  '/',
  publicFormLimiter,
  validateBody(createSponsorshipApplicationSchema),
  createSponsorshipApplication,
);

// GET /sponsorships — listagem administrativa
router.get('/', requireAdmin, listSponsorshipApplications);

// PATCH /sponsorships/:id/status — administrativo
router.patch(
  '/:id/status',
  requireAdmin,
  validateBody(updateSponsorshipStatusSchema),
  updateSponsorshipStatus,
);

export default router;
