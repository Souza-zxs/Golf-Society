import { Router } from 'express';
import { validateBody } from '../middleware/validate';
import { requireAdmin } from '../middleware/requireAdmin';
import { publicFormLimiter } from '../middleware/rateLimiter';
import {
  createMembershipApplicationSchema,
  updateMembershipStatusSchema,
} from '../schemas/membership.schema';
import {
  createMembershipApplication,
  listMembershipApplications,
  getMembershipApplication,
  updateMembershipStatus,
  deleteMembershipApplication,
} from '../controllers/membershipController';

const router = Router();

// POST /membership-applications — formulário público "Seja um Membro"
router.post(
  '/',
  publicFormLimiter,
  validateBody(createMembershipApplicationSchema),
  createMembershipApplication,
);

// GET /membership-applications — listagem administrativa
router.get('/', requireAdmin, listMembershipApplications);

// GET /membership-applications/:id — administrativo
router.get('/:id', requireAdmin, getMembershipApplication);

// PATCH /membership-applications/:id/status — administrativo (aprovar/rejeitar)
router.patch(
  '/:id/status',
  requireAdmin,
  validateBody(updateMembershipStatusSchema),
  updateMembershipStatus,
);

// DELETE /membership-applications/:id — administrativo
router.delete('/:id', requireAdmin, deleteMembershipApplication);

export default router;
