import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes.js';
import hospitalRoutes from './modules/hospitals/hospitals.routes.js';
import eventRoutes from './modules/events/events.routes.js';
import profileRoutes from "./modules/profile/profile.routes.js";
import testimonialRoutes from './modules/testimonials/testimonials.routes.js';
import tipsRoutes from './modules/tips/tips.routes.js';
import bloodMarketRoutes from './modules/blood-market/blood.routes.js';
import newsletterRoutes from './modules/newsletter/newsletter.routes.js';
import benefitsRoutes from './modules/benefits/benefits.routes.js';




const router = Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running'
  });
});


router.use('/auth', authRoutes);
router.use('/hospitals', hospitalRoutes);
router.use('/events', eventRoutes);
router.use('/profile', profileRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/tips', tipsRoutes);
router.use('/blood-market', bloodMarketRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/benefits', benefitsRoutes);



export default router;
