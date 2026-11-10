import { describe, it, expect, jest, beforeAll, afterAll } from '@jest/globals';
import http from 'http';
import mongoose from 'mongoose';

// Intercept listen and connect before server.js is imported to avoid side effects in CI
const listenSpy = jest.spyOn(http.Server.prototype, 'listen').mockImplementation(function (...args) {
  return this;
});

const connectSpy = jest.spyOn(mongoose, 'connect').mockResolvedValue(true);

let app;
let connectDB;

describe('Server & Database Configuration', () => {
  beforeAll(async () => {
    const serverModule = await import('../src/server.js');
    app = serverModule.app;
    connectDB = serverModule.connectDB;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    jest.restoreAllMocks();
  });

  it('should export the express app instance', () => {
    expect(app).toBeDefined();
    expect(typeof app).toBe('function');
  });

  it('should attempt to start listening on the configured port', () => {
    expect(listenSpy).toHaveBeenCalled();
  });

  it('should mount the router on the /api path', () => {
    const stack = app.router?.stack || app._router?.stack;
    expect(stack).toBeDefined();
    const apiLayer = stack.find(
      (layer) => (typeof layer.match === 'function' && layer.match('/api')) || layer.path === '/api'
    );
    expect(apiLayer).toBeDefined();
  });

  describe('connectDB', () => {
    it('should connect to MongoDB with process.env.MONGO_URI/ci when valid', async () => {
      const mockConn = { readyState: 1 };
      connectSpy.mockResolvedValueOnce(mockConn);

      await connectDB();

      expect(connectSpy).toHaveBeenCalledWith(`${process.env.MONGO_URI}/ci`);
    });

    it('should exit the process with status 1 if connection fails', async () => {
      connectSpy.mockResolvedValueOnce(null);
      const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

      await connectDB();

      expect(exitSpy).toHaveBeenCalledWith(1);
      exitSpy.mockRestore();
    });
  });
});
