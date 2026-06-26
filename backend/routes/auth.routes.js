import { Router } from 'express';
import { register, login, getMe, updatePassword } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate, registerSchema, loginSchema } from '../middleware/validate.middleware.js';
import { z } from 'zod';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, getMe);
router.put('/password', authenticate, validate(z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(16).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/).regex(/[^A-Za-z0-9]/),
})), updatePassword);

export default router;
