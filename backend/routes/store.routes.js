import { Router } from 'express';
import {
  getAllStores, getStoreById, createStore, updateStore, deleteStore, getMyStore,
} from '../controllers/store.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

// Public
router.get('/', getAllStores);
router.get('/:id', getStoreById);

// Protected
router.use(authenticate);

router.get('/my', authorize('STORE_OWNER'), getMyStore);
router.post('/', authorize('ADMIN'), createStore);
router.put('/:id', authorize('ADMIN', 'STORE_OWNER'), updateStore);
router.delete('/:id', authorize('ADMIN'), deleteStore);

export default router;
