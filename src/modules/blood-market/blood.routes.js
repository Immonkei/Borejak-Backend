import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import { requireRole } from '../../middlewares/role.js';
import * as controller from './blood.controller.js';

const router = Router();

// 🌍 Public
router.get('/', controller.list);
router.get('/:id', controller.detail);

// 👤 Auth user
router.post('/', auth, controller.create);
router.put('/:id/close', auth, controller.closeOwn);

// 🔒 Admin
router.delete('/:id', auth, requireRole('admin'), controller.remove);

export default router;
