import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import { requireRole } from '../../middlewares/role.js';
import * as controller from './users.controller.js';

const router = Router();

// 🔒 Admin only
router.get('/', auth, requireRole('admin'), controller.list);
router.put('/:id/role', auth, requireRole('admin'), controller.updateRole);
router.delete('/:id', auth, requireRole('admin'), controller.deactivate);

export default router;
