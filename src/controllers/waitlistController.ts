import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { sendInternalError } from '../utils/httpError';

export async function createWaitlistEntry(req: Request, res: Response) {
  const { data, error } = await supabase
    .from('waitlist_entries')
    .insert(req.body)
    .select()
    .single();

  if (error) return sendInternalError(res, 'Erro ao registrar interesse', error);
  return res.status(201).json(data);
}

export async function listWaitlistEntries(_req: Request, res: Response) {
  const { data, error } = await supabase
    .from('waitlist_entries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return sendInternalError(res, 'Erro ao listar interessados', error);
  return res.json(data);
}

export async function updateWaitlistStatus(req: Request, res: Response) {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('waitlist_entries')
    .update({ status: req.body.status })
    .eq('id', id)
    .select()
    .single();

  if (error) return sendInternalError(res, 'Erro ao atualizar status', error);
  if (!data) return res.status(404).json({ title: 'Registro não encontrado', status: 404 });
  return res.json(data);
}
