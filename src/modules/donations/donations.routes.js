import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import { requireRole } from '../../middlewares/role.js';
import * as controller from './donations.controller.js';

const router = Router();

// 👤 USER
router.post('/', auth, controller.create);
router.get('/me', auth, controller.myDonations);
router.get('/eligibility', auth, controller.eligibility);

// 🔧 REMOVED duplicate event registration route
// Event registration is now only available at: POST /events/:id/register

// 🧑‍⚕️ ADMIN
router.get('/', auth, requireRole('admin'), controller.list);
router.put('/:id/status', auth, requireRole('admin'), controller.updateStatus);

export default router;