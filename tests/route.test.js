import { describe, it, expect } from '@jest/globals';
import router from '../src/route.js';
import { getUser, updateUser, createUser, deleteUser } from '../src/controller.js';

describe('Route Definitions', () => {
  it('should export an Express router', () => {
    expect(router).toBeDefined();
    expect(typeof router).toBe('function');
    expect(Array.isArray(router.stack)).toBe(true);
  });

  it('should register GET /v1/user/:id with getUser handler', () => {
    const route = router.stack.find(
      (layer) => layer.route && layer.route.path === '/v1/user/:id' && layer.route.methods.get
    );
    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toBe(getUser);
  });

  it('should register PATCH /v1/user/:id with updateUser handler', () => {
    const route = router.stack.find(
      (layer) => layer.route && layer.route.path === '/v1/user/:id' && layer.route.methods.patch
    );
    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toBe(updateUser);
  });

  it('should register DELETE /v1/user/:id with deleteUser handler', () => {
    const route = router.stack.find(
      (layer) => layer.route && layer.route.path === '/v1/user/:id' && layer.route.methods.delete
    );
    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toBe(deleteUser);
  });

  it('should register POST ./v1/user with createUser handler', () => {
    const route = router.stack.find(
      (layer) => layer.route && layer.route.path === './v1/user' && layer.route.methods.post
    );
    expect(route).toBeDefined();
    expect(route.route.stack[0].handle).toBe(createUser);
  });
});
