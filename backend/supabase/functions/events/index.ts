import { createApp } from '../_shared/createApp.ts';
import { serveHono } from '../_shared/serve.ts';
import { supabase } from '../_shared/supabaseClient.ts';
import { validateBody, validateQuery } from '../_shared/validate.ts';
import { requireAdmin } from '../_shared/requireAdmin.ts';
import { internalError, notFound } from '../_shared/errors.ts';
import { createEventSchema, updateEventSchema, listEventsQuerySchema } from '../_shared/schemas/event.schema.ts';
import { createEventPartnerSchema, updateEventPartnerSchema } from '../_shared/schemas/eventPartner.schema.ts';

const FOREIGN_KEY_VIOLATION = '23503';

const app = createApp();

// GET /events — público, paginado, filtro opcional por status
app.get('/', validateQuery(listEventsQuerySchema), async (c) => {
  const { status, page, pageSize } = c.get('query') as { status?: string; page: number; pageSize: number };

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from('events').select('*', { count: 'exact' }).order('event_date', { ascending: true }).range(from, to);
  if (status) query = query.eq('status', status);

  const { data, error, count } = await query;

  if (error) return internalError(c, 'Erro ao listar eventos', error);
  return c.json({ data, page, pageSize, total: count ?? 0 });
});

// /events/:eventId/partners/* — administrativo (CRUD dos parceiros confirmados do evento)
// A listagem pública já vem embutida em GET /events/:slug (ver abaixo).
const partners = app.basePath('/:eventId/partners');

partners.get('/', requireAdmin, async (c) => {
  const { eventId } = c.req.param();

  const { data, error } = await supabase
    .from('event_partners')
    .select('*')
    .eq('event_id', eventId)
    .order('display_order', { ascending: true });

  if (error) return internalError(c, 'Erro ao listar parceiros', error);
  return c.json(data);
});

partners.post('/', requireAdmin, validateBody(createEventPartnerSchema), async (c) => {
  const { eventId } = c.req.param();

  const { data, error } = await supabase
    .from('event_partners')
    .insert({ ...(c.get('body') as object), event_id: eventId })
    .select()
    .single();

  if (error) {
    if (error.code === FOREIGN_KEY_VIOLATION) return notFound(c, 'Evento não encontrado');
    return internalError(c, 'Erro ao criar parceiro', error);
  }

  return c.json(data, 201);
});

partners.patch('/:id', requireAdmin, validateBody(updateEventPartnerSchema), async (c) => {
  const { eventId, id } = c.req.param();

  const { data, error } = await supabase
    .from('event_partners')
    .update(c.get('body'))
    .eq('id', id)
    .eq('event_id', eventId)
    .select()
    .maybeSingle();

  if (error) return internalError(c, 'Erro ao atualizar parceiro', error);
  if (!data) return notFound(c, 'Parceiro não encontrado');
  return c.json(data);
});

partners.delete('/:id', requireAdmin, async (c) => {
  const { eventId, id } = c.req.param();

  const { data, error } = await supabase
    .from('event_partners')
    .delete()
    .eq('id', id)
    .eq('event_id', eventId)
    .select()
    .maybeSingle();

  if (error) return internalError(c, 'Erro ao remover parceiro', error);
  if (!data) return notFound(c, 'Parceiro não encontrado');
  return c.body(null, 204);
});

// GET /events/:slug — público (já retorna os parceiros confirmados embutidos, ver README)
app.get('/:slug', async (c) => {
  const { slug } = c.req.param();

  // Parceiros confirmados vêm embutidos no mesmo payload (mesmo padrão já
  // usado para blog_posts -> blog_categories e meeting_bookings -> meeting_slots),
  // ordenados pela ordem de exibição definida pelo admin.
  const { data, error } = await supabase
    .from('events')
    .select('*, partners:event_partners(*)')
    .eq('slug', slug)
    .order('display_order', { referencedTable: 'partners', ascending: true })
    .maybeSingle();

  if (error) return internalError(c, 'Erro ao buscar evento', error);
  if (!data) return notFound(c, 'Evento não encontrado');
  return c.json(data);
});

// POST /events — administrativo
app.post('/', requireAdmin, validateBody(createEventSchema), async (c) => {
  const { data, error } = await supabase.from('events').insert(c.get('body')).select().single();

  if (error) return internalError(c, 'Erro ao criar evento', error);
  return c.json(data, 201);
});

// PATCH /events/:id — administrativo
app.patch('/:id', requireAdmin, validateBody(updateEventSchema), async (c) => {
  const { id } = c.req.param();
  const payload = { ...(c.get('body') as object), updated_at: new Date().toISOString() };

  const { data, error } = await supabase.from('events').update(payload).eq('id', id).select().single();

  if (error) return internalError(c, 'Erro ao atualizar evento', error);
  if (!data) return notFound(c, 'Evento não encontrado');
  return c.json(data);
});

// DELETE /events/:id — administrativo
app.delete('/:id', requireAdmin, async (c) => {
  const { id } = c.req.param();

  const { error } = await supabase.from('events').delete().eq('id', id);

  if (error) return internalError(c, 'Erro ao remover evento', error);
  return c.body(null, 204);
});

serveHono(app, 'events');
