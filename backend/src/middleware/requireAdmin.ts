import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

function unauthorized() {
  return {
    type: 'https://httpstatuses.com/401',
    title: 'Não autorizado',
    status: 401,
    detail: 'Header Authorization: Bearer <access_token> ausente ou inválido.',
  };
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json(unauthorized());
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return res.status(401).json(unauthorized());
  }

  next();
}
