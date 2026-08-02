import { createApp } from '../_shared/createApp.ts';
import { serveHono } from '../_shared/serve.ts';
import { supabase } from '../_shared/supabaseClient.ts';
import { env } from '../_shared/env.ts';
import { validateQuery } from '../_shared/validate.ts';
import { requireAdmin } from '../_shared/requireAdmin.ts';
import { internalError, notFound, formatZodError } from '../_shared/errors.ts';
import { uploadGalleryPhotoSchema, listGalleryPhotosQuerySchema } from '../_shared/schemas/gallery.schema.ts';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const app = createApp();

// GET /gallery — público, paginado, filtro opcional por evento
app.get('/', validateQuery(listGalleryPhotosQuerySchema), async (c) => {
  const { event_id, page, pageSize } = c.get('query') as { event_id?: string; page: number; pageSize: number };

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('gallery_photos')
    .select('*', { count: 'exact' })
    .order('uploaded_at', { ascending: false })
    .range(from, to);

  if (event_id) query = query.eq('event_id', event_id);

  const { data, error, count } = await query;

  if (error) return internalError(c, 'Erro ao listar fotos', error);
  return c.json({ data, page, pageSize, total: count ?? 0 });
});

// POST /gallery — administrativo, multipart/form-data com campo "photo"
app.post('/', requireAdmin, async (c) => {
  let form: FormData;
  try {
    form = await c.req.formData();
  } catch {
    return c.json({ title: 'Erro no upload', detail: 'Envie multipart/form-data.', status: 400 }, 400);
  }

  const file = form.get('photo');
  if (!(file instanceof File)) {
    return c.json({ title: 'Nenhum arquivo enviado', detail: 'Envie o arquivo no campo "photo".', status: 400 }, 400);
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return c.json(
      { title: 'Erro no upload', detail: 'Formato de imagem não suportado. Use JPEG, PNG ou WebP.', status: 400 },
      400,
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return c.json({ title: 'Erro no upload', detail: 'Arquivo excede o limite de 10MB.', status: 400 }, 400);
  }

  const fieldsResult = uploadGalleryPhotoSchema.safeParse({
    title: form.get('title')?.toString() || undefined,
    event_id: form.get('event_id')?.toString() || undefined,
  });
  if (!fieldsResult.success) return c.json(formatZodError(fieldsResult.error), 400);

  // Nome de arquivo gerado no servidor (nunca a partir do nome enviado pelo cliente)
  // evita path traversal e colisões.
  const extension = EXTENSION_BY_MIME[file.type] ?? 'bin';
  const storagePath = `${new Date().getFullYear()}/${crypto.randomUUID()}.${extension}`;
  const buffer = new Uint8Array(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(env.galleryBucket)
    .upload(storagePath, buffer, { contentType: file.type });

  if (uploadError) return internalError(c, 'Erro ao enviar imagem', uploadError);

  const { data: publicUrlData } = supabase.storage.from(env.galleryBucket).getPublicUrl(storagePath);

  const { data, error } = await supabase
    .from('gallery_photos')
    .insert({
      title: fieldsResult.data.title,
      event_id: fieldsResult.data.event_id ?? null,
      image_url: publicUrlData.publicUrl,
      storage_path: storagePath,
    })
    .select()
    .single();

  if (error) {
    await supabase.storage.from(env.galleryBucket).remove([storagePath]);
    return internalError(c, 'Erro ao registrar foto', error);
  }

  return c.json(data, 201);
});

// DELETE /gallery/:id — administrativo
app.delete('/:id', requireAdmin, async (c) => {
  const { id } = c.req.param();

  const { data: photo, error: fetchError } = await supabase
    .from('gallery_photos')
    .select('storage_path')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) return internalError(c, 'Erro ao buscar foto', fetchError);
  if (!photo) return notFound(c, 'Foto não encontrada');

  const { error: deleteError } = await supabase.from('gallery_photos').delete().eq('id', id);
  if (deleteError) return internalError(c, 'Erro ao remover foto', deleteError);

  await supabase.storage.from(env.galleryBucket).remove([photo.storage_path]);

  return c.body(null, 204);
});

serveHono(app, 'gallery');
