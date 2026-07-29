import { z } from 'zod';

export const createMembershipApplicationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(8).max(20),
  company: z.string().trim().min(2).max(160),
  role: z.string().trim().min(2).max(120),
  linkedin_url: z.string().trim().url().max(300).optional(),
  city: z.string().trim().max(120).optional(),
  motivation: z.string().trim().min(20).max(3000),
});

export const updateMembershipStatusSchema = z.object({
  status: z.enum(['pending', 'under_review', 'approved', 'rejected']),
});
