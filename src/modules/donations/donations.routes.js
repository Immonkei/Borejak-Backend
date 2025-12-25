import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import { requireRole } from '../../middlewares/role.js';
import * as controller from './donations.controller.js';

const router = Router();

// 👤 USER
router.post('/', auth, controller.create);
router.get('/me', auth, controller.myDonations);

// 🔥 EVENT REGISTRATION (NEW)
router.post(
  '/events/:id/register',
  auth,
  controller.registerForEvent
);

// 🧑‍⚕️ ADMIN
router.get('/', auth, requireRole('admin'), controller.list);
router.put('/:id/status', auth, requireRole('admin'), controller.updateStatus);

export default router;
