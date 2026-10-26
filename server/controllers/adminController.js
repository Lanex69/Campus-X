import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import Payment from '../models/Payment.js';
import Feedback from '../models/Feedback.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const totalServices = await Service.countDocuments();

    // Total revenue from completed payments
    const revenueAgg = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    // Bookings grouped by status
    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Bookings grouped by service category
    const bookingsByCategory = await Booking.aggregate([
      {
        $lookup: {
          from: 'services',
          localField: 'service',
          foreignField: '_id',
          as: 'serviceData',
        },
      },
      { $unwind: '$serviceData' },
      {
        $group: {
          _id: '$serviceData.category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Revenue by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const revenueByMonth = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          paidAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$paidAt' },
            month: { $month: '$paidAt' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Recent 5 bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email department')
      .populate('service', 'name category price')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalBookings,
        pendingBookings,
        totalRevenue,
        totalServices,
        bookingsByStatus: bookingsByStatus.map((b) => ({ status: b._id, count: b.count })),
        bookingsByCategory: bookingsByCategory.map((c) => ({ category: c._id, count: c.count })),
        revenueByMonth: revenueByMonth.map((r) => ({
          month: `${r._id.year}-${String(r._id.month).padStart(2, '0')}`,
          revenue: r.total,
          transactions: r.count,
        })),
        recentBookings,
      },
    });
  } catch (error) {
    console.error('Admin controller error:', error.message);
    res.status(500).json({ message: 'Administrative operation failed. Please check database connection.' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = { role: 'student' };

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { email: regex }, { department: regex }, { studentId: regex }];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      users,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    console.error('Admin controller error:', error.message);
    res.status(500).json({ message: 'Administrative operation failed. Please check database connection.' });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const bookingCount = await Booking.countDocuments({ user: user._id });
    const completedPayments = await Payment.aggregate([
      { $match: { user: user._id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalSpent = completedPayments.length > 0 ? completedPayments[0].total : 0;

    const recentBookings = await Booking.find({ user: user._id })
      .populate('service', 'name category price')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      user,
      summary: {
        bookingCount,
        totalSpent,
      },
      recentBookings,
    });
  } catch (error) {
    console.error('Admin controller error:', error.message);
    res.status(500).json({ message: 'Administrative operation failed. Please check database connection.' });
  }
};
