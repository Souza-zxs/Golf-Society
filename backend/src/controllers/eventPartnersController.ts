import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { sendInternalError } from '../utils/httpError';

const FOREIGN_KEY_VIOLATION = '23503';

export async function listEventPartnersAdmin(req: Request, res: Response) {
  const { eventId } = req.params;

  const { data, error } = await supabase
    .from('event_partners')
    .select('*')
    .eq('event_id', eventId)
    .order('display_order', { ascending: true });

  if (error) return sendInternalError(res, 'Erro ao listar parceiros', error);
  return res.json(data);
}

export async function createEventPartner(req: Request, res: Response) {
  const { eventId } = req.params;

  const { data, error } = await supabase
    .from('event_partners')
    .insert({ ...req.body, event_id: eventId })
    .select()
    .single();

  if (error) {
    if (error.code === FOREIGN_KEY_VIOLATION) {
      return res.status(404).json({ title: 'Evento não encontrado', status: 404 });
    }
    return sendInternalError(res, 'Erro ao criar parceiro', error);
  }

  return res.status(201).json(data);
}

export async function updateEventPartner(req: Request, res: Response) {
  const { eventId, id } = req.params;

  const { data, error } = await supabase
    .from('event_partners')
    .update(req.body)
    .eq('id', id)
    .eq('event_id', eventId)
    .select()
    .maybeSingle();

  if (error) return sendInternalError(res, 'Erro ao atualizar parceiro', error);
  if (!data) return res.status(404).json({ title: 'Parceiro não encontrado', status: 404 });
  return res.json(data);
}

export async function deleteEventPartner(req: Request, res: Response) {
  const { eventId, id } = req.params;

  const { data, error } = await supabase
    .from('event_partners')
    .delete()
    .eq('id', id)
    .eq('event_id', eventId)
    .select()
    .maybeSingle();

  if (error) return sendInternalError(res, 'Erro ao remover parceiro', error);
  if (!data) return res.status(404).json({ title: 'Parceiro não encontrado', status: 404 });
  return res.status(204).send();
}
