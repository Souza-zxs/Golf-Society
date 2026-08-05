import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { sendInternalError } from '../utils/httpError';
import { sendApprovalEmail } from '../services/emailService';

export async function createMembershipApplication(req: Request, res: Response) {
  const { data, error } = await supabase
    .from('membership_applications')
    .insert(req.body)
    .select()
    .single();

  if (error) return sendInternalError(res, 'Erro ao enviar candidatura', error);
  return res.status(201).json(data);
}

export async function listMembershipApplications(_req: Request, res: Response) {
  const { data, error } = await supabase
    .from('membership_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return sendInternalError(res, 'Erro ao listar candidaturas', error);
  return res.json(data);
}

export async function getMembershipApplication(req: Request, res: Response) {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('membership_applications')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) return sendInternalError(res, 'Erro ao buscar candidatura', error);
  if (!data) return res.status(404).json({ title: 'Candidatura não encontrada', status: 404 });
  return res.json(data);
}

export async function updateMembershipStatus(req: Request, res: Response) {
  const { id } = req.params;

  const { data: existing } = await supabase
    .from('membership_applications')
    .select('status')
    .eq('id', id)
    .maybeSingle();

  const { data, error } = await supabase
    .from('membership_applications')
    .update({ status: req.body.status, reviewed_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return sendInternalError(res, 'Erro ao atualizar status', error);
  if (!data) return res.status(404).json({ title: 'Candidatura não encontrada', status: 404 });

  if (data.status === 'approved' && existing?.status !== 'approved') {
    await sendApprovalEmail({ to: data.email, name: data.name, type: 'membership' });
  }

  return res.json(data);
}

export async function deleteMembershipApplication(req: Request, res: Response) {
  const { id } = req.params;

  const { error } = await supabase.from('membership_applications').delete().eq('id', id);

  if (error) return sendInternalError(res, 'Erro ao remover candidatura', error);
  return res.status(204).send();
}
