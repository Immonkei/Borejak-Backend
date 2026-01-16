import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import multer from "multer"; 
import { requireRole } from '../../middlewares/role.js';
import * as controller from './tips.controller.js';
import {uploadTipImage} from "./tips.image.controller.js";


const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});
// 🌍 Public
router.get('/', controller.listPublic);

// 🔒 Admin
router.get('/admin', auth, requireRole('admin'), controller.listAdmin);
router.post('/', auth, requireRole('admin'), controller.create);
router.put('/:id', auth, requireRole('admin'), controller.update);
router.delete('/:id', auth, requireRole('admin'), controller.remove);


// 🖼️ Admin image upload
router.post(
  "/upload-image",
  auth,
  requireRole("admin"),
  upload.single("image"),
  uploadTipImage
);


export default router;
