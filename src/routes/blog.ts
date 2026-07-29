import { Router } from 'express';
import { validateBody, validateQuery } from '../middleware/validate';
import { requireAdmin } from '../middleware/requireAdmin';
import {
  createBlogCategorySchema,
  createBlogPostSchema,
  updateBlogPostSchema,
  listBlogPostsQuerySchema,
} from '../schemas/blog.schema';
import {
  listBlogCategories,
  createBlogCategory,
  listBlogPosts,
  listBlogPostsAdmin,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '../controllers/blogController';

const router = Router();

// GET /blog/categories — público
router.get('/categories', listBlogCategories);

// POST /blog/categories — administrativo
router.post('/categories', requireAdmin, validateBody(createBlogCategorySchema), createBlogCategory);

// GET /blog/posts — público, paginado, sempre restrito a posts publicados
router.get('/posts', validateQuery(listBlogPostsQuerySchema), listBlogPosts);

// GET /blog/posts/admin — administrativo, todos os status (inclusive rascunhos)
router.get('/posts/admin', requireAdmin, validateQuery(listBlogPostsQuerySchema), listBlogPostsAdmin);

// GET /blog/posts/:slug — público
router.get('/posts/:slug', getBlogPostBySlug);

// POST /blog/posts — administrativo
router.post('/posts', requireAdmin, validateBody(createBlogPostSchema), createBlogPost);

// PATCH /blog/posts/:id — administrativo
router.patch('/posts/:id', requireAdmin, validateBody(updateBlogPostSchema), updateBlogPost);

// DELETE /blog/posts/:id — administrativo
router.delete('/posts/:id', requireAdmin, deleteBlogPost);

export default router;
