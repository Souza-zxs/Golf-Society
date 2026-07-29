import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { notFoundHandler, errorHandler } from './middleware/errorHandler';

import waitlistRouter from './routes/waitlist';
import membershipRouter from './routes/membership';
import sponsorshipRouter from './routes/sponsorship';
import meetingsRouter from './routes/meetings';
import blogRouter from './routes/blog';
import eventsRouter from './routes/events';
import galleryRouter from './routes/gallery';

const app = express();

// Atrás de proxy/CDN em produção (Render, Vercel, nginx etc.) para que o
// rate limiter identifique o IP real do cliente via X-Forwarded-For.
app.set('trust proxy', 1);

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', env: env.nodeEnv });
});

app.use('/waitlist', waitlistRouter);
app.use('/membership-applications', membershipRouter);
app.use('/sponsorships', sponsorshipRouter);
app.use('/meetings', meetingsRouter);
app.use('/blog', blogRouter);
app.use('/events', eventsRouter);
app.use('/gallery', galleryRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`⛳ Sellers Society Golf API rodando na porta ${env.port}`);
});
