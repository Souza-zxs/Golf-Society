import rateLimit from 'express-rate-limit';

// Protege formulários públicos (contato, candidaturas, agendamento) contra abuso/spam.
export const publicFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    type: 'https://httpstatuses.com/429',
    title: 'Muitas requisições, tente novamente mais tarde.',
    status: 429,
  },
});
