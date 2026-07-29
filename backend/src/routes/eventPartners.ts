import { Router } from 'express';
import { validateBody } from '../middleware/validate';
import { requireAdmin } from '../middleware/requireAdmin';
import { createEventPartnerSchema, updateEventPartnerSchema } from '../schemas/eventPartner.schema';
import {
  listEventPartnersAdmin,
  createEventPartner,
  updateEventPartner,
  deleteEventPartner,
} from '../controllers/eventPartnersController';

// mergeParams: true — precisa enxergar :eventId definido no router pai (events.ts)
const router = Router({ mergeParams: true });

// Todo o CRUD de parceiros é administrativo: a listagem pública já vem
// embutida em GET /events/:slug (ver eventsController.getEventBySlug).
router.use(requireAdmin);

// GET /events/:eventId/partners — administrativo, todos os parceiros do evento
router.get('/', listEventPartnersAdmin);

// POST /events/:eventId/partners — administrativo
router.post('/', validateBody(createEventPartnerSchema), createEventPartner);

// PATCH /events/:eventId/partners/:id — administrativo
router.patch('/:id', validateBody(updateEventPartnerSchema), updateEventPartner);

// DELETE /events/:eventId/partners/:id — administrativo
router.delete('/:id', deleteEventPartner);

export default router;
