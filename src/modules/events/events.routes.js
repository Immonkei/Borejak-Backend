import { Router } from 'express';
import multer from "multer"; // ✅ ADD THIS
import auth from '../../middlewares/auth.js';
import { requireRole } from '../../middlewares/role.js';
import * as controller from './events.controller.js';
import { registerForEvent } from '../donations/donations.controller.js';
import authOptional from "../../middlewares/authOptional.js";
import { uploadEventImage } from "./events.image.controller.js";

const router = Router();

// ✅ ADD THIS (memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
});

// 🌍 Public
router.get('/', authOptional, controller.list);
router.get('/:id', authOptional, controller.detail);

// 🔒 User - Event Registration
router.post('/:id/register', auth, registerForEvent);

// 🔒 Admin - Event CRUD
router.post('/', auth, requireRole('admin'), controller.create);
router.put('/:id', auth, requireRole('admin'), controller.update);
router.delete('/:id', auth, requireRole('admin'), controller.remove);

// 🖼️ IMAGE UPLOAD (ADMIN ONLY)
router.post(
  "/upload-image",
  auth,
  requireRole("admin"),
  upload.single("image"), // ✅ NOW THIS WORKS
  uploadEventImage
);

export default router;
