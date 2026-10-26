import Service from '../models/Service.js';
import User from '../models/User.js';

export const sampleServices = [
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
];

export const autoSeedIfEmpty = async () => {
  try {
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      console.log('🌱 Empty service database detected. Auto-seeding 6 default campus services...');
      await Service.create(sampleServices);
      console.log('✅ Default campus services seeded.');
    }

    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@smartcampus.edu';
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';
      console.log(`🌱 No admin user found. Creating default admin (${adminEmail})...`);
      await User.create({
        name: 'Dean Sarah Jenkins',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        department: 'Campus Administration',
        studentId: 'ADM-001',
        phone: '+1 (555) 010-0001',
      });
      console.log('✅ Default admin user created.');
    }
  } catch (err) {
    console.warn('⚠️ Auto-seed check notice:', err.message);
  }
};
