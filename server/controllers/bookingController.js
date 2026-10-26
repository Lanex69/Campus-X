import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Payment from '../models/Payment.js';

export const createBooking = async (req, res) => {
  try {
    const { serviceId, date, startTime, numberOfPeople = 1, purpose = '' } = req.body;

    if (!serviceId || !date || !startTime) {
      return res.status(400).json({ message: 'Service, date, and start time are required' });
    }

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: 'Campus service not found' });
    }

    if (!service.isActive) {
      return res.status(400).json({ message: 'This campus service is currently inactive' });
    }

    // Parse and normalize booking date (YYYY-MM-DD 00:00:00 UTC)
    const bookingDate = new Date(date);
    bookingDate.setUTCHours(0, 0, 0, 0);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return res.status(400).json({ message: 'Cannot book slots in the past' });
    }

    // Verify day of week is available
    const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const bookingDay = daysMap[bookingDate.getUTCDay()];

    if (!service.availableDays.includes(bookingDay)) {
      return res.status(400).json({
        message: `Service is not available on ${bookingDay}s. Available days: ${service.availableDays.join(', ')}`,
      });
    }

    // Calculate end time based on slot duration
    const [startH, startM] = startTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = startMinutes + service.duration;
    const endH = Math.floor(endMinutes / 60);
    const endM = endMinutes % 60;
    const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

    // Operating hours check
    const [serviceStartH, serviceStartM] = service.startTime.split(':').map(Number);
    const [serviceEndH, serviceEndM] = service.endTime.split(':').map(Number);
    const serviceStartMin = serviceStartH * 60 + serviceStartM;
    const serviceEndMin = serviceEndH * 60 + serviceEndM;

    if (startMinutes < serviceStartMin || endMinutes > serviceEndMin) {
      return res.status(400).json({
        message: `Requested slot is outside operating hours (${service.startTime} - ${service.endTime})`,
      });
    }

    const requestedPeople = Math.max(1, Number(numberOfPeople) || 1);

    // Concurrency / Capacity Check
    const existingActiveBookings = await Booking.find({
      service: service._id,
      date: bookingDate,
      startTime,
      status: { $in: ['pending', 'confirmed'] },
    });

    const currentOccupancy = existingActiveBookings.reduce(
      (sum, b) => sum + (b.numberOfPeople || 1),
      0
    );

    if (currentOccupancy + requestedPeople > service.capacity) {
      const remaining = Math.max(0, service.capacity - currentOccupancy);
      return res.status(409).json({
        message: `Slot capacity exceeded. Only ${remaining} spot(s) remaining for this time slot.`,
      });
    }

    // Check if this specific user already has an active booking at the exact slot
    const existingUserBooking = await Booking.findOne({
      user: req.user._id,
      service: service._id,
      date: bookingDate,
      startTime,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingUserBooking) {
      return res.status(409).json({
        message: 'You already have an active reservation for this service at this time slot',
      });
    }

    // Create the booking
    const booking = await Booking.create({
      user: req.user._id,
      service: service._id,
      date: bookingDate,
      startTime,
      endTime,
      status: 'pending',
      numberOfPeople: requestedPeople,
      purpose: purpose.trim(),
    });

    // Create associated payment record if price > 0
    let payment = null;
    if (service.price > 0) {
      payment = await Payment.create({
        booking: booking._id,
        user: req.user._id,
        amount: service.price * requestedPeople,
        method: 'campus_card',
        status: 'pending',
      });
    }

    const populatedBooking = await Booking.findById(booking._id).populate('service', 'name category price location image');

    res.status(201).json({
      success: true,
      message: 'Booking request created successfully',
      booking: populatedBooking,
      payment,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Duplicate active booking detected for this slot' });
    }
    console.error('Create booking error:', error.message);
    res.status(500).json({ message: 'Failed to create booking. Please check database connection.' });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = { user: req.user._id };

    if (status && status !== 'all') {
      query.status = status;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('service', 'name category location price duration image')
      .sort({ date: -1, startTime: -1 })
      .skip(skip)
      .limit(limitNum);

    // Attach payment info for each booking
    const bookingIds = bookings.map((b) => b._id);
    const payments = await Payment.find({ booking: { $in: bookingIds } });
    const paymentMap = new Map(payments.map((p) => [p.booking.toString(), p]));

    const enriched = bookings.map((b) => ({
      ...b.toObject(),
      payment: paymentMap.get(b._id.toString()) || null,
    }));

    res.status(200).json({
      success: true,
      bookings: enriched,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    console.error('Booking controller error:', error.message);
    res.status(500).json({ message: 'Booking operation failed. Please check database connection.' });
  }
};

export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('service')
      .populate('user', 'name email department studentId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    const payment = await Payment.findOne({ booking: booking._id });

    res.status(200).json({
      success: true,
      booking,
      payment,
    });
  } catch (error) {
    console.error('Booking controller error:', error.message);
    res.status(500).json({ message: 'Booking operation failed. Please check database connection.' });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { reason = 'Cancelled by user' } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (req.user.role !== 'admin' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({
        message: `Cannot cancel a booking that is already ${booking.status}`,
      });
    }

    // Cancellation rule: If confirmed, check if booking is in the future
    const now = new Date();
    const bookingDateTime = new Date(booking.date);
    const [h, m] = booking.startTime.split(':').map(Number);
    bookingDateTime.setUTCHours(h, m, 0, 0);

    booking.status = 'cancelled';
    booking.cancellationReason = reason.trim();
    await booking.save();

    // If associated completed payment exists, mark refunded
    const payment = await Payment.findOne({ booking: booking._id });
    if (payment && payment.status === 'completed') {
      payment.status = 'refunded';
      await payment.save();
    }

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    console.error('Booking controller error:', error.message);
    res.status(500).json({ message: 'Booking operation failed. Please check database connection.' });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const { status, serviceId, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (serviceId) {
      query.service = serviceId;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    let bookingsQuery = Booking.find(query)
      .populate('user', 'name email department studentId')
      .populate('service', 'name category location price')
      .sort({ date: -1, startTime: -1 });

    const total = await Booking.countDocuments(query);
    const bookings = await bookingsQuery.skip(skip).limit(limitNum);

    // Get payments
    const bookingIds = bookings.map((b) => b._id);
    const payments = await Payment.find({ booking: { $in: bookingIds } });
    const paymentMap = new Map(payments.map((p) => [p.booking.toString(), p]));

    const enriched = bookings.map((b) => ({
      ...b.toObject(),
      payment: paymentMap.get(b._id.toString()) || null,
    }));

    res.status(200).json({
      success: true,
      bookings: enriched,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    console.error('Booking controller error:', error.message);
    res.status(500).json({ message: 'Booking operation failed. Please check database connection.' });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status, adminNotes = '' } = req.body;
    const booking = await Booking.findById(req.params.id).populate('service');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Enforce valid state transitions
    const allowedTransitions = {
      pending: ['confirmed', 'rejected'],
      confirmed: ['completed', 'cancelled'],
      rejected: [],
      cancelled: [],
      completed: [],
    };

    const validNextStates = allowedTransitions[booking.status] || [];
    if (!validNextStates.includes(status)) {
      return res.status(400).json({
        message: `Invalid status transition from "${booking.status}" to "${status}". Allowed: ${validNextStates.join(', ') || 'None'}`,
      });
    }

    booking.status = status;
    if (adminNotes) booking.adminNotes = adminNotes.trim();
    await booking.save();

    // Associated payment updates
    const payment = await Payment.findOne({ booking: booking._id });
    if (payment) {
      if (status === 'confirmed' && payment.status === 'pending') {
        payment.status = 'completed';
        payment.paidAt = new Date();
        await payment.save();
      } else if (status === 'rejected' && payment.status === 'completed') {
        payment.status = 'refunded';
        await payment.save();
      }
    }

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      booking,
    });
  } catch (error) {
    console.error('Booking controller error:', error.message);
    res.status(500).json({ message: 'Booking operation failed. Please check database connection.' });
  }
};
