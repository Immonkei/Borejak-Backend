import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import { requireRole } from '../../middlewares/role.js';
import * as controller from './events.controller.js';
import { registerForEvent } from '../donations/donations.controller.js';
import authOptional from "../../middlewares/authOptional.js";

const router = Router();

// 🌍 Public
router.get('/', authOptional, controller.list);
router.get('/:id', authOptional, controller.detail); // 🔧 ADD authOptional for user registration status

// 🔒 User - Event Registration
router.post('/:id/register', auth, registerForEvent);

// 🔒 Admin
router.post('/', auth, requireRole('admin'), controller.create);
router.put('/:id', auth, requireRole('admin'), controller.update);
router.delete('/:id', auth, requireRole('admin'), controller.remove);

export default router;