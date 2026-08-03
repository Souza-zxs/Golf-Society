import type { Context, Next } from 'npm:hono@4';
import { supabase } from './supabaseClient.ts';

function unauthorized() {
  return {
    type: 'https://httpstatuses.com/401',
    title: 'Não autorizado',
    status: 401,
    detail: 'Header Authorization: Bearer <access_token> ausente ou inválido.',
  };
}

export async function requireAdmin(c: Context, next: Next) {
  const header = c.req.header('authorization') || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return c.json(unauthorized(), 401);
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return c.json(unauthorized(), 401);
  }

  await next();
}
