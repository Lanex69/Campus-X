import express from 'express';
import { body } from 'express-validator';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { handleValidationErrors } from '../middleware/validate.js';
import { ensureDB } from '../middleware/dbCheck.js';

const router = express.Router();

router.post(
  '/register',
  loginLimiter,
  [
    body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    handleValidationErrors,
  ],
  ensureDB,
  register
);

router.post(
  '/login',
  loginLimiter,
  [
    body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    handleValidationErrors,
  ],
  ensureDB,
  login
);

router.post('/logout', logout);

router.get('/me', protect, ensureDB, getMe);

export default router;
