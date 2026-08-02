import { Hono } from 'npm:hono@4';
import { corsMiddleware } from './cors.ts';

export function createApp() {
  const app = new Hono();

  app.use('*', corsMiddleware);

  app.notFound((c) =>
    c.json({ type: 'https://httpstatuses.com/404', title: 'Recurso não encontrado', status: 404 }, 404),
  );

  app.onError((err, c) => {
    console.error('Erro não tratado:', err);
    return c.json({ type: 'https://httpstatuses.com/500', title: 'Erro interno do servidor', status: 500 }, 500);
  });

  return app;
}
