// __tests__/adminController.test.js
const { getPendingMovies, approveMovie, getUsers } = require('../src/controllers/adminController');
const { Movie, User } = require('../src/models');

// Mock response object
let res;

beforeEach(() => {
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  jest.clearAllMocks();

  // Mock console.error to avoid clutter
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('Admin Controller', () => {
  describe('getPendingMovies', () => {
    it('should return all pending movies', async () => {
      const movies = [{ id: 1, title: 'Movie 1', approved: false }];
      jest.spyOn(Movie, 'findAll').mockResolvedValue(movies);

      await getPendingMovies({}, res);

      expect(res.json).toHaveBeenCalledWith(movies);
    });

    it('should return 500 on error', async () => {
      jest.spyOn(Movie, 'findAll').mockRejectedValue(new Error('DB Error'));

      await getPendingMovies({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB Error' });
    });
  });

  describe('approveMovie', () => {
    it('should approve a movie', async () => {
      const movie = { id: 1, approved: false, save: jest.fn() };
      jest.spyOn(Movie, 'findByPk').mockResolvedValue(movie);

      const req = { params: { id: 1 } };
      await approveMovie(req, res);

      expect(movie.approved).toBe(true);
      expect(movie.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: 'Movie approved successfully',
        movie
      });
    });

    it('should return 404 if movie not found', async () => {
      jest.spyOn(Movie, 'findByPk').mockResolvedValue(null);
      const req = { params: { id: 1 } };

      await approveMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Movie not found' });
    });

    it('should return 500 on error', async () => {
      jest.spyOn(Movie, 'findByPk').mockRejectedValue(new Error('DB Error'));
      const req = { params: { id: 1 } };

      await approveMovie(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB Error' });
    });
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const users = [{ id: 1, name: 'John', email: 'john@test.com', role: 'user' }];
      jest.spyOn(User, 'findAll').mockResolvedValue(users);

      await getUsers({}, res);

      expect(res.json).toHaveBeenCalledWith(users);
    });

    it('should return 500 on error', async () => {
      jest.spyOn(User, 'findAll').mockRejectedValue(new Error('DB Error'));

      await getUsers({}, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'DB Error' });
    });
  });
});
