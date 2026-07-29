import { z } from 'zod';

export const uploadGalleryPhotoSchema = z.object({
  title: z.string().trim().max(160).optional(),
  event_id: z.string().trim().uuid().optional(),
});

export const listGalleryPhotosQuerySchema = z.object({
  event_id: z.string().trim().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(24),
});
