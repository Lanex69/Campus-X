import express from 'express';
import { body } from 'express-validator';
import { updateProfile, changePassword } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validate.js';
import { ensureDB } from '../middleware/dbCheck.js';

const router = express.Router();

router.put('/profile', protect, ensureDB, updateProfile);

router.put(
  '/change-password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    handleValidationErrors,
  ],
  ensureDB,
  changePassword
);

export default router;
