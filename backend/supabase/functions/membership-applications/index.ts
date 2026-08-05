import { createApp } from '../_shared/createApp.ts';
import { serveHono } from '../_shared/serve.ts';
import { supabase } from '../_shared/supabaseClient.ts';
import { validateBody } from '../_shared/validate.ts';
import { requireAdmin } from '../_shared/requireAdmin.ts';
import { publicFormLimiter } from '../_shared/rateLimiter.ts';
import { internalError, notFound } from '../_shared/errors.ts';
import { sendApprovalEmail } from '../_shared/emailService.ts';
import {
  createMembershipApplicationSchema,
  updateMembershipStatusSchema,
} from '../_shared/schemas/membership.schema.ts';

const app = createApp();

// POST /membership-applications — formulário público "Seja um Membro"
app.post('/', publicFormLimiter, validateBody(createMembershipApplicationSchema), async (c) => {
  const { data, error } = await supabase.from('membership_applications').insert(c.get('body')).select().single();

  if (error) return internalError(c, 'Erro ao enviar candidatura', error);
  return c.json(data, 201);
});

// GET /membership-applications — listagem administrativa
app.get('/', requireAdmin, async (c) => {
  const { data, error } = await supabase
    .from('membership_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return internalError(c, 'Erro ao listar candidaturas', error);
  return c.json(data);
});

// GET /membership-applications/:id — administrativo
app.get('/:id', requireAdmin, async (c) => {
  const { id } = c.req.param();

  const { data, error } = await supabase.from('membership_applications').select('*').eq('id', id).maybeSingle();

  if (error) return internalError(c, 'Erro ao buscar candidatura', error);
  if (!data) return notFound(c, 'Candidatura não encontrada');
  return c.json(data);
});

// PATCH /membership-applications/:id/status — administrativo (aprovar/rejeitar)
app.patch('/:id/status', requireAdmin, validateBody(updateMembershipStatusSchema), async (c) => {
  const { id } = c.req.param();
  const body = c.get('body') as { status: string };

  const { data: existing } = await supabase
    .from('membership_applications')
    .select('status')
    .eq('id', id)
    .maybeSingle();

  const { data, error } = await supabase
    .from('membership_applications')
    .update({ status: body.status, reviewed_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return internalError(c, 'Erro ao atualizar status', error);
  if (!data) return notFound(c, 'Candidatura não encontrada');

  if (data.status === 'approved' && existing?.status !== 'approved') {
    await sendApprovalEmail({ to: data.email, name: data.name, type: 'membership' });
  }

  return c.json(data);
});

// DELETE /membership-applications/:id — administrativo
app.delete('/:id', requireAdmin, async (c) => {
  const { id } = c.req.param();

  const { error } = await supabase.from('membership_applications').delete().eq('id', id);

  if (error) return internalError(c, 'Erro ao remover candidatura', error);
  return c.body(null, 204);
});

serveHono(app, 'membership-applications');
