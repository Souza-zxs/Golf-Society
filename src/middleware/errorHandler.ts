import { Request, Response, NextFunction } from 'express';

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({
    type: 'https://httpstatuses.com/404',
    title: 'Recurso não encontrado',
    status: 404,
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error('Erro não tratado:', err);

  res.status(500).json({
    type: 'https://httpstatuses.com/500',
    title: 'Erro interno do servidor',
    status: 500,
  });
}
