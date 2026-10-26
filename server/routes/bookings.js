import express from 'express';
import { body } from 'express-validator';
import {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validate.js';
import { ensureDB } from '../middleware/dbCheck.js';

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('serviceId').isMongoId().withMessage('Valid service ID is required'),
    body('date').isISO8601().withMessage('Valid booking date (YYYY-MM-DD) is required'),
    body('startTime').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Valid start time (HH:mm) is required'),
    handleValidationErrors,
  ],
  ensureDB,
  createBooking
);

router.get('/my', protect, ensureDB, getMyBookings);
router.get('/:id', protect, ensureDB, getBooking);
router.patch('/:id/cancel', protect, ensureDB, cancelBooking);

export default router;
