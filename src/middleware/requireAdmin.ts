import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || token !== env.adminApiKey) {
    return res.status(401).json({
      type: 'https://httpstatuses.com/401',
      title: 'Não autorizado',
      status: 401,
      detail: 'Header Authorization: Bearer <ADMIN_API_KEY> ausente ou inválido.',
    });
  }

  next();
}
