import { Router } from 'express';
import {
  getAllRatings, getRatingsByStore, getUserRatings, submitRating, updateRating, deleteRating,
} from '../controllers/rating.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { validate, ratingSchema } from '../middleware/validate.middleware.js';
import { z } from 'zod';

const router = Router();

// Public
router.get('/store/:storeId', getRatingsByStore);

// Protected
router.use(authenticate);

router.get('/', authorize('ADMIN'), getAllRatings);
router.get('/user', getUserRatings);
router.post('/', validate(ratingSchema), submitRating);
router.put('/:id', validate(z.object({ rating: z.number().int().min(1).max(5) })), updateRating);
router.delete('/:id', deleteRating);

export default router;
