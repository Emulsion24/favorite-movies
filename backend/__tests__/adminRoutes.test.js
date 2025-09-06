// __tests__/adminRoutes.test.js

// 1️⃣ Mock middlewares BEFORE importing routes
jest.mock('../src/middlewares/authMiddleware', () => ({
  authMiddleware: jest.fn((req, res, next) => next()),
  adminMiddleware: jest.fn((req, res, next) => next()),
}));

// 2️⃣ Mock controllers BEFORE importing routes
jest.mock('../src/controllers/adminController', () => ({
  getPendingMovies: jest.fn((req, res) => res.status(200).json({ message: 'pending movies' })),
  approveMovie: jest.fn((req, res) => res.status(200).json({ message: 'movie approved' })),
  getUsers: jest.fn((req, res) => res.status(200).json({ message: 'users list' })),
}));

// 3️⃣ Import after mocks
const express = require('express');
const request = require('supertest');
const adminRoutes = require('../src/routes/adminRoutes');

const { authMiddleware, adminMiddleware } = require('../src/middlewares/authMiddleware');
const { getPendingMovies, approveMovie, getUsers } = require('../src/controllers/adminController');

describe('Admin Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/admin', adminRoutes);
  });

  afterEach(() => {
    // Clear mock call counts after each test
    jest.clearAllMocks();
  });

  it('GET /admin/movies/pending should call auth, admin middleware and controller', async () => {
    const res = await request(app).get('/admin/movies/pending');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('pending movies');

    // Check that mocks were called
    expect(authMiddleware).toHaveBeenCalled();
    expect(adminMiddleware).toHaveBeenCalled();
    expect(getPendingMovies).toHaveBeenCalled();
  });

  it('PUT /admin/movies/approve/:id should call auth, admin middleware and controller', async () => {
    const res = await request(app).put('/admin/movies/approve/1');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('movie approved');

    expect(authMiddleware).toHaveBeenCalled();
    expect(adminMiddleware).toHaveBeenCalled();
    expect(approveMovie).toHaveBeenCalled();
  });

  it('GET /admin/users should call auth, admin middleware and controller', async () => {
    const res = await request(app).get('/admin/users');

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('users list');

    expect(authMiddleware).toHaveBeenCalled();
    expect(adminMiddleware).toHaveBeenCalled();
    expect(getUsers).toHaveBeenCalled();
  });
});
