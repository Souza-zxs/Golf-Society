import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

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

  if (error) return res.status(500).json({ title: 'Erro ao listar eventos', detail: error.message, status: 500 });
  return res.json({ data, page, pageSize, total: count ?? 0 });
}

export async function getEventBySlug(req: Request, res: Response) {
  const { slug } = req.params;

  const { data, error } = await supabase.from('events').select('*').eq('slug', slug).maybeSingle();

  if (error) return res.status(500).json({ title: 'Erro ao buscar evento', detail: error.message, status: 500 });
  if (!data) return res.status(404).json({ title: 'Evento não encontrado', status: 404 });
  return res.json(data);
}

export async function createEvent(req: Request, res: Response) {
  const { data, error } = await supabase.from('events').insert(req.body).select().single();

  if (error) return res.status(500).json({ title: 'Erro ao criar evento', detail: error.message, status: 500 });
  return res.status(201).json(data);
}

export async function updateEvent(req: Request, res: Response) {
  const { id } = req.params;
  const payload = { ...req.body, updated_at: new Date().toISOString() };

  const { data, error } = await supabase.from('events').update(payload).eq('id', id).select().single();

  if (error) return res.status(500).json({ title: 'Erro ao atualizar evento', detail: error.message, status: 500 });
  if (!data) return res.status(404).json({ title: 'Evento não encontrado', status: 404 });
  return res.json(data);
}

export async function deleteEvent(req: Request, res: Response) {
  const { id } = req.params;

  const { error } = await supabase.from('events').delete().eq('id', id);

  if (error) return res.status(500).json({ title: 'Erro ao remover evento', detail: error.message, status: 500 });
  return res.status(204).send();
}
