import { describe, it, expect } from '@jest/globals';
import User from '../src/model.js';

describe('User Model', () => {
  it('should have the correct model name', () => {
    expect(User.modelName).toBe('users');
  });

  it('should define name and email in the schema', () => {
    expect(User.schema.paths.name).toBeDefined();
    expect(User.schema.paths.email).toBeDefined();
  });

  it('should instantiate a new User correctly with name and email', () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com'
    };
    const user = new User(userData);

    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
  });

  describe('Email validator', () => {
    const emailValidator = User.schema.paths.email.options.validator;

    it('should have an email validator defined with proper error message', () => {
      expect(emailValidator).toBeDefined();
      expect(typeof emailValidator.validate).toBe('function');
      expect(emailValidator.message).toBe('Invalid email address');
    });

    it('should accept valid email addresses', () => {
      expect(emailValidator.validate('test@example.com')).toBe(true);
      expect(emailValidator.validate('john.doe@company.co.uk')).toBe(true);
      expect(emailValidator.validate('user+tag@domain.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(emailValidator.validate('invalid-email')).toBe(false);
      expect(emailValidator.validate('missingdomain@')).toBe(false);
      expect(emailValidator.validate('@missingusername.com')).toBe(false);
      expect(emailValidator.validate('spaces in@email.com')).toBe(false);
    });
  });
});
