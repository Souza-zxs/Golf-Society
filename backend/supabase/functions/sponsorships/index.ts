import { createApp } from '../_shared/createApp.ts';
import { serveHono } from '../_shared/serve.ts';
import { supabase } from '../_shared/supabaseClient.ts';
import { validateBody } from '../_shared/validate.ts';
import { requireAdmin } from '../_shared/requireAdmin.ts';
import { publicFormLimiter } from '../_shared/rateLimiter.ts';
import { internalError, notFound } from '../_shared/errors.ts';
import { sendApprovalEmail } from '../_shared/emailService.ts';
import {
  createSponsorshipApplicationSchema,
  updateSponsorshipStatusSchema,
} from '../_shared/schemas/sponsorship.schema.ts';

const app = createApp();

// POST /sponsorships — formulário público "Seja um Patrocinador"
app.post('/', publicFormLimiter, validateBody(createSponsorshipApplicationSchema), async (c) => {
  const { data, error } = await supabase.from('sponsorship_applications').insert(c.get('body')).select().single();

  if (error) return internalError(c, 'Erro ao enviar candidatura de patrocínio', error);
  return c.json(data, 201);
});

// GET /sponsorships — listagem administrativa
app.get('/', requireAdmin, async (c) => {
  const { data, error } = await supabase
    .from('sponsorship_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return internalError(c, 'Erro ao listar patrocinadores', error);
  return c.json(data);
});

// PATCH /sponsorships/:id/status — administrativo
app.patch('/:id/status', requireAdmin, validateBody(updateSponsorshipStatusSchema), async (c) => {
  const { id } = c.req.param();
  const body = c.get('body') as { status: string };

  const { data: existing } = await supabase
    .from('sponsorship_applications')
    .select('status')
    .eq('id', id)
    .maybeSingle();

  const { data, error } = await supabase
    .from('sponsorship_applications')
    .update({ status: body.status })
    .eq('id', id)
    .select()
    .single();

  if (error) return internalError(c, 'Erro ao atualizar status', error);
  if (!data) return notFound(c, 'Candidatura não encontrada');

  if (data.status === 'approved' && existing?.status !== 'approved') {
    await sendApprovalEmail({
      to: data.email,
      name: data.contact_name,
      type: 'sponsorship',
      company: data.company_name,
    });
  }

  return c.json(data);
});

serveHono(app, 'sponsorships');
