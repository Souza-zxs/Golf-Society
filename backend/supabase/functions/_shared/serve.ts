import type { Hono } from 'npm:hono@4';

// O Edge Runtime do Supabase encaminha o path completo da requisição
// (ex.: /functions/v1/events/algum-slug, tanto local quanto em produção).
// Reescrevemos a URL removendo tudo até e incluindo o nome da função, para
// que o app Hono possa definir suas rotas a partir da raiz ("/", "/:slug"
// etc.), do mesmo jeito que os routers Express originais.
function stripFunctionPrefix(request: Request, functionName: string): Request {
  const url = new URL(request.url);
  const segments = url.pathname.split('/').filter(Boolean);
  const idx = segments.lastIndexOf(functionName);
  const rest = idx >= 0 ? segments.slice(idx + 1) : segments;
  url.pathname = `/${rest.join('/')}`;

  return new Request(url, request);
}

export function serveHono(app: Hono, functionName: string) {
  Deno.serve((request) => app.fetch(stripFunctionPrefix(request, functionName)));
}
