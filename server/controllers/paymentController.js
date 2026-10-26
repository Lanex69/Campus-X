import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';

export const getMyPayments = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = { user: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .populate({
        path: 'booking',
        populate: { path: 'service', select: 'name category location' },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      payments,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    console.error('Payment controller error:', error.message);
    res.status(500).json({ message: 'Payment operation failed. Please check database connection.' });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Payment.countDocuments(query);
    const payments = await Payment.find(query)
      .populate('user', 'name email department studentId')
      .populate({
        path: 'booking',
        populate: { path: 'service', select: 'name category' },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      payments,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    console.error('Payment controller error:', error.message);
    res.status(500).json({ message: 'Payment operation failed. Please check database connection.' });
  }
};

export const processPayment = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { method = 'campus_card' } = req.body;

    const payment = await Payment.findOne({
      booking: bookingId,
      user: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({ message: 'No payment record found for this booking' });
    }

    if (payment.status === 'completed') {
      return res.status(400).json({ message: 'Payment has already been completed' });
    }

    // Explicit demo workflow: simulate campus card / demo wallet settlement
    payment.status = 'completed';
    payment.method = method;
    payment.paidAt = new Date();
    await payment.save();

    // Optionally auto-confirm booking once paid if it was pending
    const booking = await Booking.findById(bookingId);
    if (booking && booking.status === 'pending') {
      booking.status = 'confirmed';
      await booking.save();
    }

    res.status(200).json({
      success: true,
      message: 'DEMO Payment processed successfully. Campus card verified.',
      payment,
    });
  } catch (error) {
    console.error('Payment controller error:', error.message);
    res.status(500).json({ message: 'Payment operation failed. Please check database connection.' });
  }
};
