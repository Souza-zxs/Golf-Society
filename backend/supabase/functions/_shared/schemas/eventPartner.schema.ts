import { z } from 'npm:zod@3';

export const createEventPartnerSchema = z.object({
  name: z.string().trim().min(2).max(160),
  logo_url: z.string().trim().url().max(500),
  website: z.string().trim().url().max(300).optional(),
  tier: z.string().trim().max(60).optional(),
  display_order: z.number().int().min(0).max(1000).default(0),
});

export const updateEventPartnerSchema = createEventPartnerSchema.partial();
