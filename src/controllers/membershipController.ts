import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export async function createMembershipApplication(req: Request, res: Response) {
  const { data, error } = await supabase
    .from('membership_applications')
    .insert(req.body)
    .select()
    .single();

  if (error) return res.status(500).json({ title: 'Erro ao enviar candidatura', detail: error.message, status: 500 });
  return res.status(201).json(data);
}

export async function listMembershipApplications(_req: Request, res: Response) {
  const { data, error } = await supabase
    .from('membership_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ title: 'Erro ao listar candidaturas', detail: error.message, status: 500 });
  return res.json(data);
}

export async function getMembershipApplication(req: Request, res: Response) {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('membership_applications')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) return res.status(500).json({ title: 'Erro ao buscar candidatura', detail: error.message, status: 500 });
  if (!data) return res.status(404).json({ title: 'Candidatura não encontrada', status: 404 });
  return res.json(data);
}

export async function updateMembershipStatus(req: Request, res: Response) {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('membership_applications')
    .update({ status: req.body.status, reviewed_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ title: 'Erro ao atualizar status', detail: error.message, status: 500 });
  if (!data) return res.status(404).json({ title: 'Candidatura não encontrada', status: 404 });
  return res.json(data);
}
