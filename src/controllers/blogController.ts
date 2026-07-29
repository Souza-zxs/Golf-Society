import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { sendInternalError } from '../utils/httpError';

export async function listBlogCategories(_req: Request, res: Response) {
  const { data, error } = await supabase.from('blog_categories').select('*').order('name');

  if (error) return sendInternalError(res, 'Erro ao listar categorias', error);
  return res.json(data);
}

export async function createBlogCategory(req: Request, res: Response) {
  const { data, error } = await supabase.from('blog_categories').insert(req.body).select().single();

  if (error) return sendInternalError(res, 'Erro ao criar categoria', error);
  return res.status(201).json(data);
}

export async function listBlogPosts(req: Request, res: Response) {
  const { category, status, page, pageSize } = req.query as unknown as {
    category?: string;
    status?: string;
    page: number;
    pageSize: number;
  };

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('blog_posts')
    .select('*, blog_categories(id, name, slug)', { count: 'exact' })
    .order('published_at', { ascending: false, nullsFirst: false })
    .range(from, to);

  // Endpoint público: só posts publicados, mesmo que ?status= seja informado na query.
  // Listagem de rascunhos fica restrita ao endpoint administrativo.
  void status;
  query = query.eq('status', 'published');
  if (category) query = query.eq('category_id', category);

  const { data, error, count } = await query;

  if (error) return sendInternalError(res, 'Erro ao listar posts', error);
  return res.json({ data, page, pageSize, total: count ?? 0 });
}

export async function listBlogPostsAdmin(req: Request, res: Response) {
  const { category, status, page, pageSize } = req.query as unknown as {
    category?: string;
    status?: string;
    page: number;
    pageSize: number;
  };

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('blog_posts')
    .select('*, blog_categories(id, name, slug)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status) query = query.eq('status', status);
  if (category) query = query.eq('category_id', category);

  const { data, error, count } = await query;

  if (error) return sendInternalError(res, 'Erro ao listar posts', error);
  return res.json({ data, page, pageSize, total: count ?? 0 });
}

export async function getBlogPostBySlug(req: Request, res: Response) {
  const { slug } = req.params;

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*, blog_categories(id, name, slug)')
    .eq('slug', slug)
    .maybeSingle();

  if (error) return sendInternalError(res, 'Erro ao buscar post', error);
  if (!data) return res.status(404).json({ title: 'Post não encontrado', status: 404 });
  return res.json(data);
}

export async function createBlogPost(req: Request, res: Response) {
  const payload = {
    ...req.body,
    published_at: req.body.status === 'published' ? new Date().toISOString() : null,
  };

  const { data, error } = await supabase.from('blog_posts').insert(payload).select().single();

  if (error) return sendInternalError(res, 'Erro ao criar post', error);
  return res.status(201).json(data);
}

export async function updateBlogPost(req: Request, res: Response) {
  const { id } = req.params;
  const payload: Record<string, unknown> = { ...req.body, updated_at: new Date().toISOString() };

  if (req.body.status === 'published') {
    payload.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase.from('blog_posts').update(payload).eq('id', id).select().single();

  if (error) return sendInternalError(res, 'Erro ao atualizar post', error);
  if (!data) return res.status(404).json({ title: 'Post não encontrado', status: 404 });
  return res.json(data);
}

export async function deleteBlogPost(req: Request, res: Response) {
  const { id } = req.params;

  const { error } = await supabase.from('blog_posts').delete().eq('id', id);

  if (error) return sendInternalError(res, 'Erro ao remover post', error);
  return res.status(204).send();
}
