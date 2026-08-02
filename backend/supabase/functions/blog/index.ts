import { createApp } from '../_shared/createApp.ts';
import { serveHono } from '../_shared/serve.ts';
import { supabase } from '../_shared/supabaseClient.ts';
import { validateBody, validateQuery } from '../_shared/validate.ts';
import { requireAdmin } from '../_shared/requireAdmin.ts';
import { internalError, notFound } from '../_shared/errors.ts';
import {
  createBlogCategorySchema,
  createBlogPostSchema,
  updateBlogPostSchema,
  listBlogPostsQuerySchema,
} from '../_shared/schemas/blog.schema.ts';

const app = createApp();

// GET /blog/categories — público
app.get('/categories', async (c) => {
  const { data, error } = await supabase.from('blog_categories').select('*').order('name');

  if (error) return internalError(c, 'Erro ao listar categorias', error);
  return c.json(data);
});

// POST /blog/categories — administrativo
app.post('/categories', requireAdmin, validateBody(createBlogCategorySchema), async (c) => {
  const { data, error } = await supabase.from('blog_categories').insert(c.get('body')).select().single();

  if (error) return internalError(c, 'Erro ao criar categoria', error);
  return c.json(data, 201);
});

// GET /blog/posts — público, paginado, sempre restrito a posts publicados
app.get('/posts', validateQuery(listBlogPostsQuerySchema), async (c) => {
  const { category, page, pageSize } = c.get('query') as { category?: string; page: number; pageSize: number };

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('blog_posts')
    .select('*, blog_categories(id, name, slug)', { count: 'exact' })
    .order('published_at', { ascending: false, nullsFirst: false })
    .range(from, to)
    // Endpoint público: só posts publicados, mesmo que ?status= seja informado na query.
    // Listagem de rascunhos fica restrita ao endpoint administrativo.
    .eq('status', 'published');

  if (category) query = query.eq('category_id', category);

  const { data, error, count } = await query;

  if (error) return internalError(c, 'Erro ao listar posts', error);
  return c.json({ data, page, pageSize, total: count ?? 0 });
});

// GET /blog/posts/admin — administrativo, todos os status (inclusive rascunhos)
app.get('/posts/admin', requireAdmin, validateQuery(listBlogPostsQuerySchema), async (c) => {
  const { category, status, page, pageSize } = c.get('query') as {
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

  if (error) return internalError(c, 'Erro ao listar posts', error);
  return c.json({ data, page, pageSize, total: count ?? 0 });
});

// GET /blog/posts/:slug — público
app.get('/posts/:slug', async (c) => {
  const { slug } = c.req.param();

  const { data, error } = await supabase
    .from('blog_posts')
    .select('*, blog_categories(id, name, slug)')
    .eq('slug', slug)
    .maybeSingle();

  if (error) return internalError(c, 'Erro ao buscar post', error);
  if (!data) return notFound(c, 'Post não encontrado');
  return c.json(data);
});

// POST /blog/posts — administrativo
app.post('/posts', requireAdmin, validateBody(createBlogPostSchema), async (c) => {
  const body = c.get('body') as { status: string };
  const payload = {
    ...body,
    published_at: body.status === 'published' ? new Date().toISOString() : null,
  };

  const { data, error } = await supabase.from('blog_posts').insert(payload).select().single();

  if (error) return internalError(c, 'Erro ao criar post', error);
  return c.json(data, 201);
});

// PATCH /blog/posts/:id — administrativo
app.patch('/posts/:id', requireAdmin, validateBody(updateBlogPostSchema), async (c) => {
  const { id } = c.req.param();
  const body = c.get('body') as { status?: string };
  const payload: Record<string, unknown> = { ...body, updated_at: new Date().toISOString() };

  if (body.status === 'published') {
    payload.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase.from('blog_posts').update(payload).eq('id', id).select().single();

  if (error) return internalError(c, 'Erro ao atualizar post', error);
  if (!data) return notFound(c, 'Post não encontrado');
  return c.json(data);
});

// DELETE /blog/posts/:id — administrativo
app.delete('/posts/:id', requireAdmin, async (c) => {
  const { id } = c.req.param();

  const { error } = await supabase.from('blog_posts').delete().eq('id', id);

  if (error) return internalError(c, 'Erro ao remover post', error);
  return c.body(null, 204);
});

serveHono(app, 'blog');
