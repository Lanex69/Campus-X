import Feedback from '../models/Feedback.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';

export const createFeedback = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating) {
      return res.status(400).json({ message: 'Booking ID and rating (1-5) are required' });
    }

    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only leave feedback for your own bookings' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({
        message: 'Feedback can only be submitted for completed sessions',
      });
    }

    const existingFeedback = await Feedback.findOne({
      booking: booking._id,
      user: req.user._id,
    });

    if (existingFeedback) {
      return res.status(409).json({ message: 'You have already submitted feedback for this session' });
    }

    const feedback = await Feedback.create({
      booking: booking._id,
      user: req.user._id,
      service: booking.service,
      rating: numRating,
      comment: (comment || '').trim(),
    });

    // Recalculate average rating for the service
    const stats = await Feedback.aggregate([
      { $match: { service: booking.service } },
      {
        $group: {
          _id: '$service',
          avgRating: { $avg: '$rating' },
          total: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await Service.findByIdAndUpdate(booking.service, {
        averageRating: parseFloat(stats[0].avgRating.toFixed(1)),
        totalRatings: stats[0].total,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Thank you! Your feedback has been submitted.',
      feedback,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Feedback already submitted for this booking' });
    }
    console.error('Create feedback error:', error.message);
    res.status(500).json({ message: 'Failed to submit feedback. Please check database connection.' });
  }
};

export const getServiceFeedback = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const feedbacks = await Feedback.find({ service: serviceId })
      .populate('user', 'name department studentId')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, feedbacks });
  } catch (error) {
    console.error('Get service feedback error:', error.message);
    res.status(500).json({ message: 'Failed to retrieve feedback. Please check database connection.' });
  }
};

export const getAllFeedback = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Feedback.countDocuments();
    const feedbacks = await Feedback.find()
      .populate('user', 'name email department')
      .populate('service', 'name category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      feedbacks,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    console.error('Get all feedback error:', error.message);
    res.status(500).json({ message: 'Failed to retrieve feedback. Please check database connection.' });
  }
};
