import type { Context, Next } from 'npm:hono@4';

// Best-effort: cada instância de Edge Function tem sua própria memória (não
// há store distribuído entre regiões/invocações frias), então isso limita
// abuso "óbvio" mas não é uma garantia dura como um rate limiter centralizado.
// Suficiente para formulários públicos de baixo volume nesta fase.
const WINDOW_MS = 15 * 60 * 1000;
const LIMIT = 10;

const buckets = new Map<string, { count: number; resetAt: number }>();

function clientIp(c: Context): string {
  const forwarded = c.req.header('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || 'unknown';
}

export async function publicFormLimiter(c: Context, next: Next) {
  const ip = clientIp(c);
  const now = Date.now();
  const bucket = buckets.get(ip);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    bucket.count += 1;
    if (bucket.count > LIMIT) {
      return c.json(
        {
          type: 'https://httpstatuses.com/429',
          title: 'Muitas requisições, tente novamente mais tarde.',
          status: 429,
        },
        429,
      );
    }
  }

  await next();
}
