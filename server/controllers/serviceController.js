import Service from '../models/Service.js';
import Feedback from '../models/Feedback.js';

export const getServices = async (req, res) => {
  try {
    const {
      category,
      search,
      priceMin,
      priceMax,
      availableDay,
      isActive,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Only return active services for students/public unless specified
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    } else {
      query.isActive = true;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (availableDay) {
      query.availableDays = availableDay;
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      query.price = {};
      if (priceMin !== undefined && priceMin !== '') query.price.$gte = Number(priceMin);
      if (priceMax !== undefined && priceMax !== '') query.price.$lte = Number(priceMax);
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { description: regex }, { location: regex }];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Service.countDocuments(query);
    const services = await Service.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      services,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error) {
    console.error('Error fetching services:', error.message);
    res.status(500).json({ message: 'Failed to retrieve campus services. Please check database connection.' });
  }
};

export const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Campus service not found' });
    }

    const feedbacks = await Feedback.find({ service: service._id })
      .populate('user', 'name department studentId')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      service,
      feedbacks,
    });
  } catch (error) {
    console.error('Error fetching services:', error.message);
    res.status(500).json({ message: 'Failed to retrieve campus services. Please check database connection.' });
  }
};

export const createService = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      price,
      duration,
      capacity,
      location,
      availableDays,
      startTime,
      endTime,
      image,
      isActive,
    } = req.body;

    if (!name || !category || !description || !location) {
      return res.status(400).json({ message: 'Name, category, description, and location are required' });
    }

    const service = await Service.create({
      name: name.trim(),
      category,
      description: description.trim(),
      price: price !== undefined ? Number(price) : 0,
      duration: duration ? Number(duration) : 60,
      capacity: capacity ? Number(capacity) : 1,
      location: location.trim(),
      availableDays: availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      startTime: startTime || '08:00',
      endTime: endTime || '20:00',
      image: image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({ success: true, message: 'Service created successfully', service });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Error creating service:', error.message);
    res.status(500).json({ message: 'Failed to create campus service. Please check database connection.' });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json({ success: true, message: 'Service updated successfully', service });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    console.error('Error updating service:', error.message);
    res.status(500).json({ message: 'Failed to update campus service. Please check database connection.' });
  }
};

export const toggleServiceStatus = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    service.isActive = !service.isActive;
    await service.save();

    res.status(200).json({
      success: true,
      message: `Service is now ${service.isActive ? 'active' : 'deactivated'}`,
      service,
    });
  } catch (error) {
    console.error('Error toggling service status:', error.message);
    res.status(500).json({ message: 'Failed to update service status. Please check database connection.' });
  }
};
