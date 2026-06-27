import { z } from 'zod';

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      });
    }
    next(err);
  }
};

// Shared schemas
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(16, 'Password must be at most 16 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const registerSchema = z.object({
  name: z.string().min(1, 'Name must be at least 1 characters').max(60, 'Name must be at most 60 characters'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(5, 'Address is required').max(400, 'Address too long'),
  password: passwordSchema,
  role: z.enum(['USER', 'STORE_OWNER']).default('USER'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

export const storeSchema = z.object({
  name: z.string().min(1, 'Store name must be at least 1 characters').max(60, 'Store name must be at most 60 characters'),
  email: z.string().email('Invalid email'),
  address: z.string().min(5, 'Address required').max(400, 'Address too long'),
  ownerId: z.string().optional().nullable(),
});

export const ratingSchema = z.object({
  storeId: z.string().min(1, 'Store ID required'),
  rating: z.number().int().min(1, 'Rating must be 1–5').max(5, 'Rating must be 1–5'),
});
