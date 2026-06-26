import { Router } from 'express';
import { getAdminStats, getOwnerStats, getUserStats } from '../controllers/dashboard.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/admin', authorize('ADMIN'), getAdminStats);
router.get('/owner', authorize('STORE_OWNER'), getOwnerStats);
router.get('/user', authorize('USER'), getUserStats);

export default router;
