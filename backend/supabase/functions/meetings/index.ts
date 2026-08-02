import { createApp } from '../_shared/createApp.ts';
import { serveHono } from '../_shared/serve.ts';
import { supabase } from '../_shared/supabaseClient.ts';
import { validateBody } from '../_shared/validate.ts';
import { requireAdmin } from '../_shared/requireAdmin.ts';
import { publicFormLimiter } from '../_shared/rateLimiter.ts';
import { internalError, notFound } from '../_shared/errors.ts';
import { createMeetingSlotSchema, createMeetingBookingSchema } from '../_shared/schemas/meeting.schema.ts';

const app = createApp();

// GET /meetings/slots — público, lista somente horários abertos
app.get('/slots', async (c) => {
  const { data, error } = await supabase
    .from('meeting_slots')
    .select('*')
    .eq('status', 'open')
    .order('starts_at', { ascending: true });

  if (error) return internalError(c, 'Erro ao listar horários', error);
  return c.json(data);
});

// GET /meetings/slots/admin — administrativo, lista horários em qualquer status
app.get('/slots/admin', requireAdmin, async (c) => {
  const { data, error } = await supabase.from('meeting_slots').select('*').order('starts_at', { ascending: true });

  if (error) return internalError(c, 'Erro ao listar horários', error);
  return c.json(data);
});

// POST /meetings/slots — administrativo, cria horário disponível para agendamento
app.post('/slots', requireAdmin, validateBody(createMeetingSlotSchema), async (c) => {
  const { data, error } = await supabase
    .from('meeting_slots')
    .insert({ ...(c.get('body') as object), status: 'open' })
    .select()
    .single();

  if (error) return internalError(c, 'Erro ao criar horário', error);
  return c.json(data, 201);
});

// DELETE /meetings/slots/:id — administrativo, cancela horário
app.delete('/slots/:id', requireAdmin, async (c) => {
  const { id } = c.req.param();

  const { data, error } = await supabase
    .from('meeting_slots')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .select()
    .single();

  if (error) return internalError(c, 'Erro ao cancelar horário', error);
  if (!data) return notFound(c, 'Horário não encontrado');
  return c.json(data);
});

// POST /meetings/slots/:id/book — público, reserva um horário
app.post('/slots/:id/book', publicFormLimiter, validateBody(createMeetingBookingSchema), async (c) => {
  const slotId = c.req.param('id');

  // Update condicionado a status='open' evita corrida entre duas reservas simultâneas
  // no mesmo horário: só uma requisição consegue transicionar o slot para 'booked'.
  const { data: updatedSlot, error: updateError } = await supabase
    .from('meeting_slots')
    .update({ status: 'booked' })
    .eq('id', slotId)
    .eq('status', 'open')
    .select()
    .maybeSingle();

  if (updateError) return internalError(c, 'Erro ao reservar horário', updateError);

  if (!updatedSlot) {
    const { data: existingSlot } = await supabase.from('meeting_slots').select('id').eq('id', slotId).maybeSingle();
    if (!existingSlot) return notFound(c, 'Horário não encontrado');
    return c.json(
      { title: 'Horário indisponível', detail: 'Este horário já foi reservado ou cancelado.', status: 409 },
      409,
    );
  }

  const { data: booking, error: bookingError } = await supabase
    .from('meeting_bookings')
    .insert({ ...(c.get('body') as object), slot_id: slotId })
    .select()
    .single();

  if (bookingError) {
    // Reserva falhou após travar o slot: libera o horário para não perder a vaga.
    await supabase.from('meeting_slots').update({ status: 'open' }).eq('id', slotId);
    return internalError(c, 'Erro ao reservar horário', bookingError);
  }

  return c.json(booking, 201);
});

// GET /meetings/bookings — administrativo, lista reservas
app.get('/bookings', requireAdmin, async (c) => {
  const { data, error } = await supabase
    .from('meeting_bookings')
    .select('*, meeting_slots(starts_at, ends_at, location)')
    .order('created_at', { ascending: false });

  if (error) return internalError(c, 'Erro ao listar reservas', error);
  return c.json(data);
});

serveHono(app, 'meetings');
