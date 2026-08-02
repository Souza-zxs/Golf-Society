import type { Context, Next } from 'npm:hono@4';
import type { ZodTypeAny } from 'npm:zod@3';
import { formatZodError } from './errors.ts';

export function validateBody(schema: ZodTypeAny) {
  return async (c: Context, next: Next) => {
    let body: unknown = {};
    try {
      body = await c.req.json();
    } catch {
      // corpo ausente ou não é JSON válido: zod vai rejeitar abaixo
    }

    const result = schema.safeParse(body);
    if (!result.success) return c.json(formatZodError(result.error), 400);

    c.set('body', result.data);
    await next();
  };
}

export function validateQuery(schema: ZodTypeAny) {
  return async (c: Context, next: Next) => {
    const result = schema.safeParse(c.req.query());
    if (!result.success) return c.json(formatZodError(result.error), 400);

    c.set('query', result.data);
    await next();
  };
}
