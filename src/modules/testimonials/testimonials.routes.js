import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import { requireRole } from '../../middlewares/role.js';
import * as controller from './testimonials.controller.js';

const router = Router();

// 🌍 Public — approved testimonials
router.get('/', controller.listPublic);

// 👤 User — submit testimonial
router.post('/', auth, controller.create);

// 🔒 Admin — moderation
router.get('/admin', auth, requireRole('admin'), controller.listAdmin);
router.put('/admin/:id/approve', auth, requireRole('admin'), controller.approve);
router.put('/admin/:id', auth, requireRole('admin'), controller.update);
router.delete('/admin/:id', auth, requireRole('admin'), controller.remove);

export default router;
