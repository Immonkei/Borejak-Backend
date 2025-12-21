import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import { requireRole } from '../../middlewares/role.js';
import * as controller from './newsletter.controller.js';

const router = Router();

// 🌍 Public
router.post('/subscribe', controller.subscribe);
router.post('/unsubscribe', controller.unsubscribe);

// 🔒 Admin
router.get('/', auth, requireRole('admin'), controller.list);

export default router;
