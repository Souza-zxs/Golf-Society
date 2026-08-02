import { z } from 'npm:zod@3';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createEventSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().toLowerCase().regex(slugRegex, 'slug deve estar em kebab-case').max(220),
  description: z.string().trim().max(3000).optional(),
  event_date: z.string().trim().date(),
  start_time: z.string().trim().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional(),
  end_time: z.string().trim().regex(/^\d{2}:\d{2}(:\d{2})?$/).optional(),
  location: z.string().trim().max(200).optional(),
  address: z.string().trim().max(300).optional(),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).default('upcoming'),
  cover_image_url: z.string().trim().url().max(500).optional(),
  max_attendees: z.number().int().min(1).max(5000).optional(),
});

export const updateEventSchema = createEventSchema.partial();

export const listEventsQuerySchema = z.object({
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
});
