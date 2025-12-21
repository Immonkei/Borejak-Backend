import { Router } from 'express';
import auth from '../../middlewares/auth.js';
import * as controller from './benefits.controller.js';

const router = Router();

router.get('/me', auth, controller.myBenefits);

export default router;
