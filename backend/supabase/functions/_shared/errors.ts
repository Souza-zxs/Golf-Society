import type { Context } from 'npm:hono@4';
import type { ZodError } from 'npm:zod@3';

export function notFound(c: Context, title: string) {
  return c.json({ type: 'https://httpstatuses.com/404', title, status: 404 }, 404);
}

// Loga o erro completo (útil para debug/observabilidade) mas nunca repassa a
// mensagem crua do banco/Supabase ao cliente — evita vazar detalhes de
// schema, constraints ou infraestrutura em respostas HTTP.
export function internalError(c: Context, title: string, error: unknown) {
  console.error(`${title}:`, error);

  return c.json(
    {
      type: 'https://httpstatuses.com/500',
      title,
      status: 500,
      detail: 'Erro interno, tente novamente mais tarde.',
    },
    500,
  );
}

export function formatZodError(error: ZodError) {
  return {
    type: 'https://httpstatuses.com/400',
    title: 'Dados inválidos',
    status: 400,
    errors: error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    })),
  };
}
