import { z } from 'npm:zod@3';

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createBlogCategorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().toLowerCase().regex(slugRegex, 'slug deve estar em kebab-case').max(100),
});

export const createBlogPostSchema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().toLowerCase().regex(slugRegex, 'slug deve estar em kebab-case').max(220),
  excerpt: z.string().trim().max(400).optional(),
  content: z.string().trim().min(20),
  cover_image_url: z.string().trim().url().max(500).optional(),
  category_id: z.string().trim().uuid().optional(),
  author_name: z.string().trim().max(120).optional(),
  status: z.enum(['draft', 'published']).default('draft'),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

export const listBlogPostsQuerySchema = z.object({
  category: z.string().trim().uuid().optional(),
  status: z.enum(['draft', 'published']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(10),
});
