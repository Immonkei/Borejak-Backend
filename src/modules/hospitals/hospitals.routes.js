import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import { requireRole } from '../../middlewares/role.js';
import * as controller from './hospitals.controller.js';

const router = Router();

// 🌍 Public
router.get('/', controller.list);
router.get('/:id', controller.detail);

// 🔒 Admin only
router.post('/', auth, requireRole('admin'), controller.create);
router.put('/:id', auth, requireRole('admin'), controller.update);
router.delete('/:id', auth, requireRole('admin'), controller.remove);


export default router;
