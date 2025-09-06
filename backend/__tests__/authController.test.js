// backend/tests/authController.test.js
const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');

// Mock models, bcrypt, and jwt before importing controller
jest.mock('../src/models', () => require('../__mocks__/models'));
jest.mock('bcrypt', () => ({
  hash: jest.fn(() => 'hashedPassword'),
  compare: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'jwtToken'),
  verify: jest.fn(),
}));

const { User } = require('../src/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authController = require('../src/controllers/authController');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.post('/register', authController.register);
app.post('/login', authController.login);
app.post('/logout', authController.logout);
app.get('/me', authController.CheckAuth);

describe('Auth Controller', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('Register', () => {
    it('should register a new user', async () => {
      User.create.mockResolvedValue({ id: 1, name: 'John', email: 'john@example.com', password: 'hashedPassword', role: 'user' });

      const res = await request(app).post('/register').send({ name: 'John', email: 'john@example.com', password: 'password123' });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User registered successfully');
      expect(User.create).toHaveBeenCalledWith(expect.objectContaining({ name: 'John', email: 'john@example.com', password: 'hashedPassword', role: 'user' }));
    });

    it('should return 400 if User.create throws', async () => {
      User.create.mockRejectedValue(new Error('DB error'));
      const res = await request(app).post('/register').send({ name: 'John', email: 'john@example.com', password: 'password123' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('DB error');
    });
  });

  describe('Login', () => {
    it('should login a user', async () => {
      User.findOne.mockResolvedValue({ id: 1, email: 'john@example.com', password: 'hashedPassword', role: 'user' });
      bcrypt.compare.mockResolvedValue(true);

      const res = await request(app).post('/login').send({ email: 'john@example.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Login successful');
      expect(res.body.user).toEqual({ id: 1, email: 'john@example.com', role: 'user' });
      expect(jwt.sign).toHaveBeenCalled();
    });

    it('should return 404 if user not found', async () => {
      User.findOne.mockResolvedValue(null);
      const res = await request(app).post('/login').send({ email: 'unknown@example.com', password: 'password123' });
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('User not found');
    });

    it('should return 401 if password incorrect', async () => {
      User.findOne.mockResolvedValue({ id: 1, email: 'john@example.com', password: 'hashedPassword', role: 'user' });
      bcrypt.compare.mockResolvedValue(false);
      const res = await request(app).post('/login').send({ email: 'john@example.com', password: 'wrongpass' });
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });
  });

  describe('Logout', () => {
    it('should clear the cookie', async () => {
      const res = await request(app).post('/logout');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Logged out successfully');
    });
  });

  describe('CheckAuth', () => {
    it('should return user data if token is valid', async () => {
      jwt.verify.mockReturnValue({ id: 1, email: 'john@example.com', role: 'user' });
      const res = await request(app).get('/me').set('Cookie', ['token=validToken']);
      expect(res.status).toBe(200);
      expect(res.body.user).toEqual({ id: 1, email: 'john@example.com', role: 'user' });
    });

    it('should return 401 if no token', async () => {
      const res = await request(app).get('/me');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Not authenticated');
    });

    it('should return 401 if token invalid', async () => {
      jwt.verify.mockImplementation(() => { throw new Error('Invalid'); });
      const res = await request(app).get('/me').set('Cookie', ['token=badToken']);
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid token');
    });
  });
});
