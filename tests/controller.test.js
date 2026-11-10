import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import User from '../src/model.js';
import { createUser, updateUser, getUser, deleteUser } from '../src/controller.js';

const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('User Controllers', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createUser', () => {
    it('should return 400 when name is missing', async () => {
      const req = {
        body: () => ({ email: 'john@example.com' })
      };
      const res = createMockResponse();

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'name and email are mandatory'
      });
    });

    it('should return 400 when email is missing', async () => {
      const req = {
        body: () => ({ name: 'John Doe' })
      };
      const res = createMockResponse();

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'name and email are mandatory'
      });
    });

    it('should create a user and return 201 when valid data is provided', async () => {
      const req = {
        body: () => ({ name: 'John Doe', email: 'john@example.com' })
      };
      const res = createMockResponse();
      const mockCreatedUser = {
        _id: '12345',
        name: 'John Doe',
        email: 'john@example.com'
      };

      jest.spyOn(User, 'insertOne').mockResolvedValue(mockCreatedUser);

      await createUser(req, res);

      expect(User.insertOne).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com'
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: mockCreatedUser
      });
    });

    it('should throw TypeError if req.body is not a callable function', async () => {
      const req = {
        body: { name: 'John', email: 'john@example.com' }
      };
      const res = createMockResponse();

      await expect(createUser(req, res)).rejects.toThrow(TypeError);
    });
  });

  describe('updateUser', () => {
    it('should update user and return 200 on success', async () => {
      const req = {
        params: { id: 'user123' },
        body: { name: 'Jane Doe', email: 'jane@example.com' }
      };
      const res = createMockResponse();
      const mockUpdatedUser = {
        _id: 'user123',
        name: 'Jane Doe',
        email: 'jane@example.com'
      };

      jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValue(mockUpdatedUser);

      await updateUser(req, res);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        'user123',
        { name: 'Jane Doe', email: 'jane@example.com', phone: undefined },
        { new: true, runValidators: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { user: mockUpdatedUser }
      });
    });

    it('should return 404 when user to update is not found', async () => {
      const req = {
        params: { id: 'nonexistent-id' },
        body: { name: 'Nobody' }
      };
      const res = createMockResponse();

      jest.spyOn(User, 'findByIdAndUpdate').mockResolvedValue(null);

      await updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'User not found'
      });
    });
  });

  describe('getUser', () => {
    afterEach(() => {
      delete global.req;
      delete global.res;
    });

    it('should fail with ReferenceError when req is not in scope', async () => {
      await expect(getUser()).rejects.toThrow(ReferenceError);
    });

    it('should return 200 with user data when req/res are present in scope', async () => {
      const mockUser = { _id: 'user123', name: 'Alice', email: 'alice@example.com' };
      global.req = { params: { id: 'user123' } };
      global.res = createMockResponse();

      jest.spyOn(User, 'findById').mockResolvedValue(mockUser);

      await getUser();

      expect(User.findById).toHaveBeenCalledWith('user123');
      expect(global.res.status).toHaveBeenCalledWith(200);
      expect(global.res.json).toHaveBeenCalledWith({
        status: 'success',
        data: { user: mockUser }
      });
    });

    it('should return 404 when user is not found', async () => {
      global.req = { params: { id: 'notfound-id' } };
      global.res = createMockResponse();

      jest.spyOn(User, 'findById').mockResolvedValue(null);

      await getUser();

      expect(global.res.status).toHaveBeenCalledWith(404);
      expect(global.res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'User not found'
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete user and return 201 with success message', async () => {
      const req = { params: { id: 'user123' } };
      const res = createMockResponse();
      const mockDeletedUser = { _id: 'user123', name: 'Bob' };

      jest.spyOn(User, 'findByIdAndDelete').mockResolvedValue(mockDeletedUser);

      await deleteUser(req, res);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith('user123');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: `user ${mockDeletedUser} deleted sucessfully`
      });
    });
  });
});
