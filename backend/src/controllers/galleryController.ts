import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { env } from '../config/env';
import { sendInternalError } from '../utils/httpError';

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export async function listGalleryPhotos(req: Request, res: Response) {
  const { event_id, page, pageSize } = req.query as unknown as {
    event_id?: string;
    page: number;
    pageSize: number;
  };

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('gallery_photos')
    .select('*', { count: 'exact' })
    .order('uploaded_at', { ascending: false })
    .range(from, to);

  if (event_id) query = query.eq('event_id', event_id);

  const { data, error, count } = await query;

  if (error) return sendInternalError(res, 'Erro ao listar fotos', error);
  return res.json({ data, page, pageSize, total: count ?? 0 });
}

export async function uploadGalleryPhoto(req: Request, res: Response) {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ title: 'Nenhum arquivo enviado', detail: 'Envie o arquivo no campo "photo".', status: 400 });
  }

  // Nome de arquivo gerado no servidor (nunca a partir do nome enviado pelo cliente)
  // evita path traversal e colisões.
  const extension = EXTENSION_BY_MIME[file.mimetype] ?? 'bin';
  const storagePath = `${new Date().getFullYear()}/${randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(env.galleryBucket)
    .upload(storagePath, file.buffer, { contentType: file.mimetype });

  if (uploadError) {
    return sendInternalError(res, 'Erro ao enviar imagem', uploadError);
  }

  const { data: publicUrlData } = supabase.storage.from(env.galleryBucket).getPublicUrl(storagePath);

  const { data, error } = await supabase
    .from('gallery_photos')
    .insert({
      title: req.body.title,
      event_id: req.body.event_id ?? null,
      image_url: publicUrlData.publicUrl,
      storage_path: storagePath,
    })
    .select()
    .single();

  if (error) {
    await supabase.storage.from(env.galleryBucket).remove([storagePath]);
    return sendInternalError(res, 'Erro ao registrar foto', error);
  }

  return res.status(201).json(data);
}

export async function deleteGalleryPhoto(req: Request, res: Response) {
  const { id } = req.params;

  const { data: photo, error: fetchError } = await supabase
    .from('gallery_photos')
    .select('storage_path')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) return sendInternalError(res, 'Erro ao buscar foto', fetchError);
  if (!photo) return res.status(404).json({ title: 'Foto não encontrada', status: 404 });

  const { error: deleteError } = await supabase.from('gallery_photos').delete().eq('id', id);
  if (deleteError) return sendInternalError(res, 'Erro ao remover foto', deleteError);

  await supabase.storage.from(env.galleryBucket).remove([photo.storage_path]);

  return res.status(204).send();
}
