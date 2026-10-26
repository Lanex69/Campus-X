import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import Feedback from '../models/Feedback.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Load .env from server/.env or root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is not set. Please set it in .env before running seed.');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    const seedOptions = { serverSelectionTimeoutMS: 5000 };
    if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
      seedOptions.family = 4;
    }
    await mongoose.connect(uri, seedOptions);
    console.log('Connected! Clearing existing collections...');

    await Promise.all([
      User.deleteMany({}),
      Service.deleteMany({}),
      Booking.deleteMany({}),
      Payment.deleteMany({}),
      Feedback.deleteMany({}),
    ]);

    console.log('Creating Admin & Student users...');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@smartcampus.edu';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

    const admin = await User.create({
      name: 'Dean Sarah Jenkins',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      department: 'Campus Administration',
      studentId: 'ADM-001',
      phone: '+1 (555) 010-0001',
    });

    const student1 = await User.create({
      name: 'Rahul Sharma',
      email: 'student@campus.edu',
      password: 'Student@123',
      role: 'student',
      department: 'Computer Science & Engineering',
      studentId: 'CS2024-042',
      phone: '+1 (555) 010-0042',
    });

    const student2 = await User.create({
      name: 'Priya Patel',
      email: 'priya@campus.edu',
      password: 'Student@123',
      role: 'student',
      department: 'Biomedical Engineering',
      studentId: 'BM2024-118',
      phone: '+1 (555) 010-0118',
    });

    const student3 = await User.create({
      name: 'Alex Chen',
      email: 'alex@campus.edu',
      password: 'Student@123',
      role: 'student',
      department: 'Robotics & Automation',
      studentId: 'RO2024-089',
      phone: '+1 (555) 010-0089',
    });

    console.log('Seeding 6 Campus Services...');
    const services = await Service.create([
      {
        name: 'Library Acoustic Study Room',
        category: 'Library',
        description: 'Soundproof collaborative study space with smart presentation screen, whiteboard, and ergonomic seating.',
        price: 0,
        duration: 60,
        capacity: 6,
        location: 'Central Library, 3rd Floor, Wing A (Room 304)',
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        startTime: '08:00',
        endTime: '22:00',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Advanced Computer Lab Workstation',
        category: 'Computer Lab',
        description: 'High-performance computing terminals with dual 4K monitors, GPU acceleration, and pre-installed developer suites.',
        price: 5,
        duration: 120,
        capacity: 30,
        location: 'Alan Turing Hall, Lab 204',
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        startTime: '08:00',
        endTime: '20:00',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Indoor Badminton Arena (Court 1)',
        category: 'Sports',
        description: 'Tournament-spec sprung timber court with anti-glare LED lighting, Yonex nets, and locker access.',
        price: 10,
        duration: 60,
        capacity: 4,
        location: 'Phoenix Sports Complex, Main Arena',
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        startTime: '06:00',
        endTime: '21:00',
        image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Srinivasa Ramanujan Grand Auditorium',
        category: 'Auditorium',
        description: '450-seat premier venue with Christie 4K laser projection, concert audio system, and professional stage lighting.',
        price: 50,
        duration: 180,
        capacity: 200,
        location: 'Administration Complex, Central Hall',
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        startTime: '09:00',
        endTime: '18:00',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Campus Eco-Express Electric Shuttle',
        category: 'Shuttle',
        description: 'Zero-emission electric campus shuttle connecting Residence Halls, Central Academic Core, and Research Park.',
        price: 2,
        duration: 30,
        capacity: 30,
        location: 'Transit Bay North, Dock 1',
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        startTime: '07:00',
        endTime: '19:00',
        image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?w=600&auto=format&fit=crop&q=80',
        isActive: true,
      },
      {
        name: 'Equipment Rental: 4K Laser Projector Suite',
        category: 'Equipment',
        description: 'Portable ultra-bright laser projector kit with HDMI wireless transmitters, tripod, and carrying case.',
        price: 15,
        duration: 240,
        capacity: 5,
        location: 'Media Resource Center, Desk B',
        availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        startTime: '08:00',
        endTime: '17:00',
        image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600&auto=format&fit=crop&q=80',
        isActive: true,
      },
    ]);

    console.log('Seeding initial Bookings, Payments, and Feedback...');
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // 1. Completed booking with payment & feedback
    const completedBooking = await Booking.create({
      user: student1._id,
      service: services[1]._id, // Computer Lab
      date: yesterday,
      startTime: '10:00',
      endTime: '12:00',
      status: 'completed',
      numberOfPeople: 1,
      purpose: 'Senior Capstone AI model evaluation',
    });

    await Payment.create({
      booking: completedBooking._id,
      user: student1._id,
      amount: 5,
      method: 'campus_card',
      status: 'completed',
      paidAt: yesterday,
    });

    await Feedback.create({
      booking: completedBooking._id,
      user: student1._id,
      service: services[1]._id,
      rating: 5,
      comment: 'Excellent dual-screen workstation! GPUs ran PyTorch benchmarks with zero thermal throttling.',
    });

    // Update service rating
    services[1].averageRating = 5.0;
    services[1].totalRatings = 1;
    await services[1].save();

    // 2. Confirmed upcoming booking
    const confirmedBooking = await Booking.create({
      user: student1._id,
      service: services[0]._id, // Library study room
      date: tomorrow,
      startTime: '14:00',
      endTime: '15:00',
      status: 'confirmed',
      numberOfPeople: 4,
      purpose: 'Capstone peer review session',
    });

    // 3. Pending request awaiting admin approval
    const pendingBooking = await Booking.create({
      user: student2._id,
      service: services[3]._id, // Auditorium
      date: tomorrow,
      startTime: '10:00',
      endTime: '13:00',
      status: 'pending',
      numberOfPeople: 80,
      purpose: 'Biomedical Innovation Annual Symposium',
    });

    await Payment.create({
      booking: pendingBooking._id,
      user: student2._id,
      amount: 50,
      method: 'campus_card',
      status: 'pending',
    });

    console.log('=======================================================');
    console.log('✅ Database seeded successfully:');
    console.log(`- 1 Administrator (${adminEmail})`);
    console.log(`- 3 Students (${student1.email}, ${student2.email}, ${student3.email})`);
    console.log(`- 6 Campus Services across all required categories`);
    console.log(`- Sample Bookings (completed, confirmed, pending)`);
    console.log(`- Sample Demo Payments & Verified Feedback`);
    console.log('=======================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Seed failure:', error);
    process.exit(1);
  }
};

seedDatabase();
