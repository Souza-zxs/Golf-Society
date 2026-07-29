import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { sendInternalError } from '../utils/httpError';

export async function listEvents(req: Request, res: Response) {
  const { status, page, pageSize } = req.query as unknown as {
    status?: string;
    page: number;
    pageSize: number;
  };

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('events')
    .select('*', { count: 'exact' })
    .order('event_date', { ascending: true })
    .range(from, to);

  if (status) query = query.eq('status', status);

  const { data, error, count } = await query;

  if (error) return sendInternalError(res, 'Erro ao listar eventos', error);
  return res.json({ data, page, pageSize, total: count ?? 0 });
}

export async function getEventBySlug(req: Request, res: Response) {
  const { slug } = req.params;

  // Parceiros confirmados vêm embutidos no mesmo payload (mesmo padrão já
  // usado para blog_posts -> blog_categories e meeting_bookings -> meeting_slots),
  // ordenados pela ordem de exibição definida pelo admin.
  const { data, error } = await supabase
    .from('events')
    .select('*, partners:event_partners(*)')
    .eq('slug', slug)
    .order('display_order', { referencedTable: 'partners', ascending: true })
    .maybeSingle();

  if (error) return sendInternalError(res, 'Erro ao buscar evento', error);
  if (!data) return res.status(404).json({ title: 'Evento não encontrado', status: 404 });
  return res.json(data);
}

export async function createEvent(req: Request, res: Response) {
  const { data, error } = await supabase.from('events').insert(req.body).select().single();

  if (error) return sendInternalError(res, 'Erro ao criar evento', error);
  return res.status(201).json(data);
}

export async function updateEvent(req: Request, res: Response) {
  const { id } = req.params;
  const payload = { ...req.body, updated_at: new Date().toISOString() };

  const { data, error } = await supabase.from('events').update(payload).eq('id', id).select().single();

  if (error) return sendInternalError(res, 'Erro ao atualizar evento', error);
  if (!data) return res.status(404).json({ title: 'Evento não encontrado', status: 404 });
  return res.json(data);
}

export async function deleteEvent(req: Request, res: Response) {
  const { id } = req.params;

  const { error } = await supabase.from('events').delete().eq('id', id);

  if (error) return sendInternalError(res, 'Erro ao remover evento', error);
  return res.status(204).send();
}
