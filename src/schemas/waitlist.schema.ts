import { z } from 'zod';

export const createWaitlistEntrySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(8).max(20),
  company: z.string().trim().max(160).optional(),
  role: z.string().trim().max(120).optional(),
  city: z.string().trim().max(120).optional(),
  referred_by: z.string().trim().max(160).optional(),
  message: z.string().trim().max(2000).optional(),
});

export const updateWaitlistStatusSchema = z.object({
  status: z.enum(['pending', 'under_review', 'approved', 'rejected']),
});
