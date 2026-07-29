import { Router } from 'express';
import { validateBody } from '../middleware/validate';
import { requireAdmin } from '../middleware/requireAdmin';
import { publicFormLimiter } from '../middleware/rateLimiter';
import { createMeetingSlotSchema, createMeetingBookingSchema } from '../schemas/meeting.schema';
import {
  listMeetingSlots,
  createMeetingSlot,
  cancelMeetingSlot,
  bookMeetingSlot,
  listMeetingBookings,
} from '../controllers/meetingsController';

const router = Router();

// GET /meetings/slots — público, lista horários disponíveis (?status=all para ver todos, admin)
router.get('/slots', listMeetingSlots);

// POST /meetings/slots — administrativo, cria horário disponível para agendamento
router.post('/slots', requireAdmin, validateBody(createMeetingSlotSchema), createMeetingSlot);

// DELETE /meetings/slots/:id — administrativo, cancela horário
router.delete('/slots/:id', requireAdmin, cancelMeetingSlot);

// POST /meetings/slots/:id/book — público, reserva um horário
router.post(
  '/slots/:id/book',
  publicFormLimiter,
  validateBody(createMeetingBookingSchema),
  bookMeetingSlot,
);

// GET /meetings/bookings — administrativo, lista reservas
router.get('/bookings', requireAdmin, listMeetingBookings);

export default router;
