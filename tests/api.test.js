import { describe, it, expect, jest, afterEach } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import router from '../src/route.js';
import User from '../src/model.js';

// Create a standalone express app mounting the router for API testing
const app = express();
app.use(express.json());
app.use('/api', router);

describe('API Integration Tests (via Supertest)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('PATCH /api/v1/user/:id', () => {
    it('should return 200 and updated user', async () => {
      const mockUpdatedUser = {
        _id: '507f1f77bcf86cd799439011',
        name: 'John Updated',
        email: 'john.updated@example.com'
      };

      jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValue(mockUpdatedUser);

      const response = await request(app)
        .patch('/api/v1/user/507f1f77bcf86cd799439011')
        .send({ name: 'John Updated' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'success',
        data: {
          user: mockUpdatedUser
        }
      });
    });

    it('should return 404 when user is not found', async () => {
      jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValue(null);

      const response = await request(app)
        .patch('/api/v1/user/nonexistent')
        .send({ name: 'Ghost' });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        status: 'fail',
        message: 'User not found'
      });
    });
  });

  describe('DELETE /api/v1/user/:id', () => {
    it('should return 201 when user is deleted', async () => {
      const mockDeletedUser = { _id: '507f1f77bcf86cd799439011', name: 'John' };
      jest.spyOn(User, 'findByIdAndDelete').mockResolvedValue(mockDeletedUser);

      const response = await request(app).delete('/api/v1/user/507f1f77bcf86cd799439011');

      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
    });
  });

  describe('Route Not Found', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app).get('/api/v1/undefined-endpoint');
      expect(response.status).toBe(404);
    });
  });
});
