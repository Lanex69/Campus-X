import express from 'express';
import { body } from 'express-validator';
import {
  getServices,
  getService,
  createService,
  updateService,
  toggleServiceStatus,
} from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validate.js';
import { ensureDB } from '../middleware/dbCheck.js';

const router = express.Router();

router.get('/', ensureDB, getServices);
router.get('/:id', ensureDB, getService);

router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('name').trim().notEmpty().withMessage('Service name is required'),
    body('category')
      .isIn(['Library', 'Computer Lab', 'Sports', 'Auditorium', 'Shuttle', 'Equipment'])
      .withMessage('Valid category is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be 0 or higher'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('duration').isInt({ min: 15 }).withMessage('Duration must be at least 15 minutes'),
    handleValidationErrors,
  ],
  ensureDB,
  createService
);

router.put('/:id', protect, authorize('admin'), ensureDB, updateService);
router.patch('/:id/toggle', protect, authorize('admin'), ensureDB, toggleServiceStatus);

export default router;
