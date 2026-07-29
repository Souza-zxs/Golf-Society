import { createHash, timingSafeEqual } from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

const expectedTokenHash = createHash('sha256').update(env.adminApiKey).digest();

function isValidToken(token: string): boolean {
  // Compara hashes de tamanho fixo (sha256 = 32 bytes sempre) em tempo constante,
  // assim nem o tamanho do token informado nem seu conteúdo vazam pelo timing.
  const candidateHash = createHash('sha256').update(token).digest();
  return timingSafeEqual(candidateHash, expectedTokenHash);
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token || !isValidToken(token)) {
    return res.status(401).json({
      type: 'https://httpstatuses.com/401',
      title: 'Não autorizado',
      status: 401,
      detail: 'Header Authorization: Bearer <ADMIN_API_KEY> ausente ou inválido.',
    });
  }

  next();
}
