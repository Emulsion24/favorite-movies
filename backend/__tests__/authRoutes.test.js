const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('../src/routes/authRoutes'); // adjust if needed

const app = express();
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

// Mock authController correctly
jest.mock('../src/controllers/authController', () => ({
  register: jest.fn((req, res) => res.status(201).json({ message: 'User registered' })),
  login: jest.fn((req, res) => res.status(200).json({ token: 'mock-token' })),
  logout: jest.fn((req, res) => res.status(200).json({ message: 'Logged out' })),
  CheckAuth: jest.fn((req, res) => res.status(200).json({ user: 'mock-user' })),
}));

describe('Auth Routes', () => {
  it('POST /register should register user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'test', password: '123456' });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered');
  });

  it('POST /login should login user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'test', password: '123456' });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBe('mock-token');
  });

  it('POST /logout should logout user', async () => {
    const res = await request(app).post('/api/auth/logout');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Logged out');
  });

  it('GET /me should return authenticated user', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toBe('mock-user');
  });
});
