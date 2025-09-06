// __tests__/movieRoutes.test.js
const request = require('supertest');
const express = require('express');

// 1️⃣ Mock middlewares
jest.mock('../src/middlewares/authMiddleware', () => ({
  authMiddleware: jest.fn((req, res, next) => next()),
  adminMiddleware: jest.fn((req, res, next) => next()),
}));

// 2️⃣ Mock controllers
jest.mock('../src/controllers/movieController', () => ({
  createMovie: jest.fn((req, res) => res.status(201).json({ message: 'movie created' })),
  getallMovies: jest.fn((req, res) => res.status(200).json({ message: 'all movies' })),
  deleteMovie: jest.fn((req, res) => res.status(200).json({ message: 'movie deleted' })),
  updateMovie: jest.fn((req, res) => res.status(200).json({ message: 'movie updated' })),
  getMovie: jest.fn((req, res) => res.status(200).json({ message: 'get movie' })),
  updateMovieStatus: jest.fn((req, res) => res.status(200).json({ message: 'status updated' })),
  getUserMovie: jest.fn((req, res) => res.status(200).json({ message: 'user movies' })),
}));

// 3️⃣ Mock multer
jest.mock('../src/config/multer', () => ({
  single: jest.fn(() => (req, res, next) => next()),
}));

// 4️⃣ Import mocks
const { authMiddleware, adminMiddleware } = require('../src/middlewares/authMiddleware');
const {
  createMovie,
  getallMovies,
  deleteMovie,
  updateMovie,
  getMovie,
  updateMovieStatus,
  getUserMovie,
} = require('../src/controllers/movieController');

const upload = require('../src/config/multer');

const movieRoutes = require('../src/routes/movieRoutes');

describe('Movie Routes', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/movies', movieRoutes);
  });

  it('POST /movies/create should call auth middleware, multer and createMovie controller', async () => {
    const res = await request(app).post('/movies/create').attach('image', Buffer.from(''), 'test.jpg');
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('movie created');
    expect(authMiddleware).toHaveBeenCalled();
    expect(upload.single).toHaveBeenCalledWith('image');
    expect(createMovie).toHaveBeenCalled();
  });

  it('GET /movies/ should call auth middleware and getMovie controller', async () => {
    const res = await request(app).get('/movies/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('get movie');
    expect(authMiddleware).toHaveBeenCalled();
    expect(getMovie).toHaveBeenCalled();
  });

  it('GET /movies/user should call auth middleware and getUserMovie controller', async () => {
    const res = await request(app).get('/movies/user');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('user movies');
    expect(authMiddleware).toHaveBeenCalled();
    expect(getUserMovie).toHaveBeenCalled();
  });

  it('GET /movies/all should call admin middleware and getallMovies controller', async () => {
    const res = await request(app).get('/movies/all');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('all movies');
    expect(adminMiddleware).toHaveBeenCalled();
    expect(getallMovies).toHaveBeenCalled();
  });

  it('DELETE /movies/:id should call auth middleware and deleteMovie controller', async () => {
    const res = await request(app).delete('/movies/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('movie deleted');
    expect(authMiddleware).toHaveBeenCalled();
    expect(deleteMovie).toHaveBeenCalled();
  });

  it('PUT /movies/:id should call auth middleware, multer and updateMovie controller', async () => {
    const res = await request(app).put('/movies/1').attach('image', Buffer.from(''), 'test.jpg');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('movie updated');
    expect(authMiddleware).toHaveBeenCalled();
    expect(upload.single).toHaveBeenCalledWith('image');
    expect(updateMovie).toHaveBeenCalled();
  });

  it('PATCH /movies/:id/status should call admin middleware and updateMovieStatus controller', async () => {
    const res = await request(app).patch('/movies/1/status');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('status updated');
    expect(adminMiddleware).toHaveBeenCalled();
    expect(updateMovieStatus).toHaveBeenCalled();
  });
});
