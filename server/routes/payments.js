import express from 'express';
import { getMyPayments, processPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';
import { ensureDB } from '../middleware/dbCheck.js';

const router = express.Router();

router.get('/my', protect, ensureDB, getMyPayments);
router.post('/:bookingId/pay', protect, ensureDB, processPayment);

export default router;
