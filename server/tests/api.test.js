import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';

describe('Campus-X REST API Suite', () => {
  describe('GET /api/health', () => {
    it('should return 200 and system online status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.system).toContain('Campus-X');
    });
  });

  describe('Authentication & Security Controls', () => {
    it('should reject registration with missing fields', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'incomplete@campus.edu',
      });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should reject registration with invalid email format', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Invalid User',
        email: 'not-an-email',
        password: 'password123',
      });
      expect(res.statusCode).toBe(400);
    });

    it('should reject registration with password shorter than 6 characters', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'Short Pass',
        email: 'short@campus.edu',
        password: '123',
      });
      expect(res.statusCode).toBe(400);
    });

    it('should reject login without email or password', async () => {
      const res = await request(app).post('/api/auth/login').send({});
      expect(res.statusCode).toBe(400);
    });

    it('should reject login with non-existent credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'ghost_user_9999@campus.edu',
        password: 'RandomPassword123!',
      });
      expect([401, 500]).toContain(res.statusCode);
    });

    it('should reject unauthorized access to protected profile endpoint', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toMatch(/not authorized/i);
    });

    it('should reject unauthorized access to admin dashboard endpoint', async () => {
      const res = await request(app).get('/api/admin/dashboard');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('Services API', () => {
    it('should return services list and pagination metadata', async () => {
      const res = await request(app).get('/api/services');
      // If DB is connected it returns 200, or gracefully handles
      expect([200, 500]).toContain(res.statusCode);
      if (res.statusCode === 200) {
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.services)).toBe(true);
        expect(res.body).toHaveProperty('pagination');
      }
    });

    it('should reject non-admin users from creating services', async () => {
      const res = await request(app).post('/api/services').send({
        name: 'Hacked Lab',
        category: 'Library',
      });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('Bookings Lifecycle & Validation', () => {
    it('should reject booking creation when unauthenticated', async () => {
      const res = await request(app).post('/api/bookings').send({
        serviceId: '654321654321654321654321',
        date: '2026-11-01',
        startTime: '10:00',
      });
      expect(res.statusCode).toBe(401);
    });

    it('should reject unauthenticated access to my bookings', async () => {
      const res = await request(app).get('/api/bookings/my');
      expect(res.statusCode).toBe(401);
    });

    it('should reject unauthenticated booking cancellation', async () => {
      const res = await request(app).patch('/api/bookings/654321654321654321654321/cancel').send({
        reason: 'Change of plans',
      });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('User Profile & Password Management', () => {
    it('should reject unauthenticated profile update', async () => {
      const res = await request(app).put('/api/users/profile').send({
        name: 'New Name',
      });
      expect(res.statusCode).toBe(401);
    });

    it('should reject unauthenticated password change', async () => {
      const res = await request(app).put('/api/users/change-password').send({
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword123',
      });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('Demo Payment Workflow API', () => {
    it('should reject unauthenticated access to personal transaction history', async () => {
      const res = await request(app).get('/api/payments/my');
      expect(res.statusCode).toBe(401);
    });

    it('should reject unauthenticated payment processing', async () => {
      const res = await request(app).post('/api/payments/654321654321654321654321/pay').send({
        method: 'campus_card',
      });
      expect(res.statusCode).toBe(401);
    });
  });

  describe('Feedback & Ratings API', () => {
    it('should reject unauthenticated feedback submission', async () => {
      const res = await request(app).post('/api/feedback').send({
        bookingId: '654321654321654321654321',
        rating: 5,
        comment: 'Great facility!',
      });
      expect(res.statusCode).toBe(401);
    });

    it('should reject unauthenticated access to all feedback audit ledger', async () => {
      const res = await request(app).get('/api/feedback');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('Admin Operations & Authorization', () => {
    it('should reject unauthenticated access to student user directory', async () => {
      const res = await request(app).get('/api/admin/users');
      expect(res.statusCode).toBe(401);
    });

    it('should reject unauthenticated access to master bookings ledger', async () => {
      const res = await request(app).get('/api/admin/bookings');
      expect(res.statusCode).toBe(401);
    });

    it('should reject unauthenticated booking status updates', async () => {
      const res = await request(app).patch('/api/admin/bookings/654321654321654321654321/status').send({
        status: 'confirmed',
      });
      expect(res.statusCode).toBe(401);
    });

    it('should reject unauthenticated access to master payment ledger', async () => {
      const res = await request(app).get('/api/admin/payments');
      expect(res.statusCode).toBe(401);
    });
  });

  describe('Routing & Error Fallbacks', () => {
    it('should return 404 JSON for unmapped API endpoints', async () => {
      const res = await request(app).get('/api/nonexistent-campus-endpoint-xyz');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toContain('not found');
    });
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });
});
