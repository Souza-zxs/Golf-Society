import { z } from 'zod';

export const createSponsorshipApplicationSchema = z.object({
  company_name: z.string().trim().min(2).max(160),
  contact_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(8).max(20),
  website: z.string().trim().url().max(300).optional(),
  sponsorship_tier: z.string().trim().max(120).optional(),
  message: z.string().trim().max(3000).optional(),
});

export const updateSponsorshipStatusSchema = z.object({
  status: z.enum(['pending', 'under_review', 'approved', 'rejected']),
});
