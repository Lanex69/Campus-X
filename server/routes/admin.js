import express from 'express';
import { body } from 'express-validator';
import {
  getDashboardStats,
  getUsers,
  getUserDetails,
} from '../controllers/adminController.js';
import { getAllBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { getAllPayments } from '../controllers/paymentController.js';
import { getAllFeedback } from '../controllers/feedbackController.js';
import { protect, authorize } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validate.js';
import { ensureDB } from '../middleware/dbCheck.js';

const router = express.Router();

// Admin-only middleware applied to all routes in this file
router.use(protect, authorize('admin'), ensureDB);

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.get('/users/:id', getUserDetails);

router.get('/bookings', getAllBookings);
router.patch(
  '/bookings/:id/status',
  [
    body('status')
      .isIn(['confirmed', 'rejected', 'completed', 'cancelled'])
      .withMessage('Valid status is required'),
    handleValidationErrors,
  ],
  updateBookingStatus
);

router.get('/payments', getAllPayments);
router.get('/feedback', getAllFeedback);

export default router;
