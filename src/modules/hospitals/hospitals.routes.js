import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import { requireRole } from '../../middlewares/role.js';
import * as controller from './hospitals.controller.js';
import multer from "multer";
import { uploadHospitalImage } from './hospitals.image.controller.js';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

// 🌍 Public
router.get('/', controller.list);
router.get('/:id', controller.detail);

// 🔒 Admin only
router.post('/', auth, requireRole('admin'), controller.create);
router.put('/:id', auth, requireRole('admin'), controller.update);
router.delete('/:id', auth, requireRole('admin'), controller.remove);

// 🖼️ Image upload (ADMIN)
router.post(
  "/upload-image",
  auth,
  requireRole("admin"),
  upload.single("image"),
  uploadHospitalImage
);

export default router;
