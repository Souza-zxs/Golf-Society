import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodTypeAny } from 'zod';

export function validateBody(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json(formatZodError(result.error));
    }

    req.body = result.data;
    next();
  };
}

export function validateQuery(schema: ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json(formatZodError(result.error));
    }

    // Express 5 expõe `req.query` como getter somente-leitura no prototype;
    // reatribuir diretamente lança TypeError. Definir a propriedade na
    // instância do request sombreia o getter e permite passar os dados
    // já validados/coeridos pelo zod adiante.
    Object.defineProperty(req, 'query', {
      value: result.data,
      writable: true,
      configurable: true,
    });
    next();
  };
}

function formatZodError(error: ZodError) {
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
