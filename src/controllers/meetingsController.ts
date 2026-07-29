import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export async function listMeetingSlots(req: Request, res: Response) {
  const onlyOpen = req.query.status !== 'all';

  let query = supabase.from('meeting_slots').select('*').order('starts_at', { ascending: true });
  if (onlyOpen) query = query.eq('status', 'open');

  const { data, error } = await query;

  if (error) return res.status(500).json({ title: 'Erro ao listar horários', detail: error.message, status: 500 });
  return res.json(data);
}

export async function createMeetingSlot(req: Request, res: Response) {
  const { data, error } = await supabase
    .from('meeting_slots')
    .insert({ ...req.body, status: 'open' })
    .select()
    .single();

  if (error) return res.status(500).json({ title: 'Erro ao criar horário', detail: error.message, status: 500 });
  return res.status(201).json(data);
}

export async function cancelMeetingSlot(req: Request, res: Response) {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('meeting_slots')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ title: 'Erro ao cancelar horário', detail: error.message, status: 500 });
  if (!data) return res.status(404).json({ title: 'Horário não encontrado', status: 404 });
  return res.json(data);
}

export async function bookMeetingSlot(req: Request, res: Response) {
  const { id: slotId } = req.params;

  // Update condicionado a status='open' evita corrida entre duas reservas simultâneas
  // no mesmo horário: só uma requisição consegue transicionar o slot para 'booked'.
  const { data: updatedSlot, error: updateError } = await supabase
    .from('meeting_slots')
    .update({ status: 'booked' })
    .eq('id', slotId)
    .eq('status', 'open')
    .select()
    .maybeSingle();

  if (updateError) return res.status(500).json({ title: 'Erro ao reservar horário', detail: updateError.message, status: 500 });

  if (!updatedSlot) {
    const { data: existingSlot } = await supabase.from('meeting_slots').select('id').eq('id', slotId).maybeSingle();
    if (!existingSlot) return res.status(404).json({ title: 'Horário não encontrado', status: 404 });
    return res.status(409).json({ title: 'Horário indisponível', detail: 'Este horário já foi reservado ou cancelado.', status: 409 });
  }

  const { data: booking, error: bookingError } = await supabase
    .from('meeting_bookings')
    .insert({ ...req.body, slot_id: slotId })
    .select()
    .single();

  if (bookingError) {
    // Reserva falhou após travar o slot: libera o horário para não perder a vaga.
    await supabase.from('meeting_slots').update({ status: 'open' }).eq('id', slotId);
    return res.status(500).json({ title: 'Erro ao reservar horário', detail: bookingError.message, status: 500 });
  }

  return res.status(201).json(booking);
}

export async function listMeetingBookings(_req: Request, res: Response) {
  const { data, error } = await supabase
    .from('meeting_bookings')
    .select('*, meeting_slots(starts_at, ends_at, location)')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ title: 'Erro ao listar reservas', detail: error.message, status: 500 });
  return res.json(data);
}
