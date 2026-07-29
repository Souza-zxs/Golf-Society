import { Router } from 'express';
import { validateBody, validateQuery } from '../middleware/validate';
import { requireAdmin } from '../middleware/requireAdmin';
import { createEventSchema, updateEventSchema, listEventsQuerySchema } from '../schemas/event.schema';
import {
  listEvents,
  getEventBySlug,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventsController';
import eventPartnersRouter from './eventPartners';

const router = Router();

// GET /events — público, paginado, filtro opcional por status
router.get('/', validateQuery(listEventsQuerySchema), listEvents);

// /events/:eventId/partners/* — administrativo (CRUD dos parceiros confirmados do evento)
router.use('/:eventId/partners', eventPartnersRouter);

// GET /events/:slug — público (já retorna os parceiros confirmados embutidos, ver README)
router.get('/:slug', getEventBySlug);

// POST /events — administrativo
router.post('/', requireAdmin, validateBody(createEventSchema), createEvent);

// PATCH /events/:id — administrativo
router.patch('/:id', requireAdmin, validateBody(updateEventSchema), updateEvent);

// DELETE /events/:id — administrativo
router.delete('/:id', requireAdmin, deleteEvent);

export default router;
