import { Router, Request, Response, NextFunction } from 'express';
import { validateBody, validateQuery } from '../middleware/validate';
import { requireAdmin } from '../middleware/requireAdmin';
import { uploadSingleImage } from '../middleware/upload';
import { uploadGalleryPhotoSchema, listGalleryPhotosQuerySchema } from '../schemas/gallery.schema';
import { listGalleryPhotos, uploadGalleryPhoto, deleteGalleryPhoto } from '../controllers/galleryController';

const router = Router();

function handleUpload(req: Request, res: Response, next: NextFunction) {
  uploadSingleImage(req, res, (err: unknown) => {
    if (err) {
      const message = err instanceof Error ? err.message : 'Erro ao processar upload';
      return res.status(400).json({ title: 'Erro no upload', detail: message, status: 400 });
    }
    next();
  });
}

// GET /gallery — público, paginado, filtro opcional por evento
router.get('/', validateQuery(listGalleryPhotosQuerySchema), listGalleryPhotos);

// POST /gallery — administrativo, multipart/form-data com campo "photo"
router.post('/', requireAdmin, handleUpload, validateBody(uploadGalleryPhotoSchema), uploadGalleryPhoto);

// DELETE /gallery/:id — administrativo
router.delete('/:id', requireAdmin, deleteGalleryPhoto);

export default router;
