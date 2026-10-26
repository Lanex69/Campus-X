import express from 'express';
import { body } from 'express-validator';
import {
  createFeedback,
  getServiceFeedback,
  getAllFeedback,
} from '../controllers/feedbackController.js';
import { protect, authorize } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validate.js';
import { ensureDB } from '../middleware/dbCheck.js';

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('bookingId').isMongoId().withMessage('Valid booking ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters'),
    handleValidationErrors,
  ],
  ensureDB,
  createFeedback
);

router.get('/service/:serviceId', ensureDB, getServiceFeedback);
router.get('/', protect, authorize('admin'), ensureDB, getAllFeedback);

export default router;
