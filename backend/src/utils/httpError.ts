import { Response } from 'express';

// Loga o erro completo (útil para debug/observabilidade) mas nunca repassa a
// mensagem crua do banco/Supabase ao cliente — evita vazar detalhes de
// schema, constraints ou infraestrutura em respostas HTTP.
export function sendInternalError(res: Response, title: string, error: unknown) {
  console.error(`${title}:`, error);

  return res.status(500).json({
    type: 'https://httpstatuses.com/500',
    title,
    status: 500,
    detail: 'Erro interno, tente novamente mais tarde.',
  });
}
