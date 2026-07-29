import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { sendInternalError } from '../utils/httpError';

export async function createSponsorshipApplication(req: Request, res: Response) {
  const { data, error } = await supabase
    .from('sponsorship_applications')
    .insert(req.body)
    .select()
    .single();

  if (error) return sendInternalError(res, 'Erro ao enviar candidatura de patrocínio', error);
  return res.status(201).json(data);
}

export async function listSponsorshipApplications(_req: Request, res: Response) {
  const { data, error } = await supabase
    .from('sponsorship_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return sendInternalError(res, 'Erro ao listar patrocinadores', error);
  return res.json(data);
}

export async function updateSponsorshipStatus(req: Request, res: Response) {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('sponsorship_applications')
    .update({ status: req.body.status })
    .eq('id', id)
    .select()
    .single();

  if (error) return sendInternalError(res, 'Erro ao atualizar status', error);
  if (!data) return res.status(404).json({ title: 'Candidatura não encontrada', status: 404 });
  return res.json(data);
}
