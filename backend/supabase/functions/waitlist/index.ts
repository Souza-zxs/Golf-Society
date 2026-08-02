import { createApp } from '../_shared/createApp.ts';
import { serveHono } from '../_shared/serve.ts';
import { supabase } from '../_shared/supabaseClient.ts';
import { validateBody } from '../_shared/validate.ts';
import { requireAdmin } from '../_shared/requireAdmin.ts';
import { publicFormLimiter } from '../_shared/rateLimiter.ts';
import { internalError, notFound } from '../_shared/errors.ts';
import { createWaitlistEntrySchema, updateWaitlistStatusSchema } from '../_shared/schemas/waitlist.schema.ts';

const app = createApp();

// POST /waitlist — formulário público de contato / lista de espera
app.post('/', publicFormLimiter, validateBody(createWaitlistEntrySchema), async (c) => {
  const { data, error } = await supabase.from('waitlist_entries').insert(c.get('body')).select().single();

  if (error) return internalError(c, 'Erro ao registrar interesse', error);
  return c.json(data, 201);
});

// GET /waitlist — listagem administrativa
app.get('/', requireAdmin, async (c) => {
  const { data, error } = await supabase
    .from('waitlist_entries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return internalError(c, 'Erro ao listar interessados', error);
  return c.json(data);
});

// PATCH /waitlist/:id/status — administrativo
app.patch('/:id/status', requireAdmin, validateBody(updateWaitlistStatusSchema), async (c) => {
  const { id } = c.req.param();
  const body = c.get('body') as { status: string };

  const { data, error } = await supabase
    .from('waitlist_entries')
    .update({ status: body.status })
    .eq('id', id)
    .select()
    .single();

  if (error) return internalError(c, 'Erro ao atualizar status', error);
  if (!data) return notFound(c, 'Registro não encontrado');
  return c.json(data);
});

serveHono(app, 'waitlist');
