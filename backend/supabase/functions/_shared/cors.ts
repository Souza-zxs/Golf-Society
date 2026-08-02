import { cors } from 'npm:hono@4/cors';
import { env } from './env.ts';

export const corsMiddleware = cors({
  origin: env.corsOrigins,
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
});
