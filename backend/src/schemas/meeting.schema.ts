import { z } from 'zod';

export const createMeetingSlotSchema = z
  .object({
    starts_at: z.string().trim().datetime({ offset: true }),
    ends_at: z.string().trim().datetime({ offset: true }),
    location: z.string().trim().max(200).optional(),
    capacity: z.number().int().min(1).max(50).default(1),
  })
  .refine((slot) => new Date(slot.ends_at) > new Date(slot.starts_at), {
    message: 'ends_at deve ser posterior a starts_at',
    path: ['ends_at'],
  });

export const createMeetingBookingSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(8).max(20),
  company: z.string().trim().max(160).optional(),
  notes: z.string().trim().max(1000).optional(),
});
