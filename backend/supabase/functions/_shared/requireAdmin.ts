import type { Context, Next } from 'npm:hono@4';
import { timingSafeEqual, createHash } from 'node:crypto';
import { env } from './env.ts';

const expectedTokenHash = createHash('sha256').update(env.adminApiKey).digest();

function isValidToken(token: string): boolean {
  // Compara hashes de tamanho fixo (sha256 = 32 bytes sempre) em tempo constante,
  // assim nem o tamanho do token informado nem seu conteúdo vazam pelo timing.
  const candidateHash = createHash('sha256').update(token).digest();
  return timingSafeEqual(candidateHash, expectedTokenHash);
}

export async function requireAdmin(c: Context, next: Next) {
  const header = c.req.header('authorization') || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token || !isValidToken(token)) {
    return c.json(
      {
        type: 'https://httpstatuses.com/401',
        title: 'Não autorizado',
        status: 401,
        detail: 'Header Authorization: Bearer <ADMIN_API_KEY> ausente ou inválido.',
      },
      401,
    );
  }

  await next();
}
