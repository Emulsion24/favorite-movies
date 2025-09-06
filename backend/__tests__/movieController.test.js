const { createMovie, getMovie, updateMovie, deleteMovie, updateMovieStatus, getUserMovie, getallMovies } = require('../src/controllers/movieController');
const { Movie } = require('../src/models');

jest.mock('../src/models', () => ({
  Movie: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAndCountAll: jest.fn(),
  },
}));

describe('Movie Controller', () => {

  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: { id: 1, role: 'user' },
      params: { id: 1 },
      query: {},
      file: null,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  // ===================== createMovie =====================
  it('should create a movie', async () => {
    req.body = { title: 'Inception', type: 'Movie', director: 'Nolan', budget: '100', location: 'LA', duration: '120', year: '2010' };
    Movie.create.mockResolvedValue({ id: 1, ...req.body, approved: false, deleted: false });

    await createMovie(req, res);

    expect(Movie.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String), movie: expect.any(Object) }));
  });

  // ===================== getMovie =====================
  it('should get movies with pagination', async () => {
    Movie.findAndCountAll.mockResolvedValue({ rows: [{ title: 'Inception' }], count: 1 });

    await getMovie(req, res);

    expect(Movie.findAndCountAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ movies: expect.any(Array), hasMore: false }));
  });

  // ===================== updateMovie =====================
  it('should update a movie', async () => {
    const movie = { update: jest.fn(), userId: 1, deleted: false, image_url: null };
    req.body = { title: 'Interstellar' };
    Movie.findByPk.mockResolvedValue(movie);

    await updateMovie(req, res);

    expect(movie.update).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.any(String), movie }));
  });

  it('should return 403 if not owner', async () => {
    const movie = { userId: 2, deleted: false, update: jest.fn() };
    req.user.role = 'user';
    Movie.findByPk.mockResolvedValue(movie);

    await updateMovie(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden' });
  });

  // ===================== deleteMovie =====================
  it('should delete a movie', async () => {
    const movie = { userId: 1, deleted: false, save: jest.fn() };
    Movie.findByPk.mockResolvedValue(movie);

    await deleteMovie(req, res);

    expect(movie.deleted).toBe(true);
    expect(movie.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ message: 'Movie deleted successfully' });
  });

  // ===================== updateMovieStatus =====================
  it('should update movie status', async () => {
    const movie = { deleted: false, save: jest.fn() };
    req.body.status = 'approved';
    Movie.findByPk.mockResolvedValue(movie);

    await updateMovieStatus(req, res);

    expect(movie.status).toBe('approved');
    expect(movie.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // ===================== getUserMovie =====================
  it('should get user movies', async () => {
    Movie.findAndCountAll.mockResolvedValue({ rows: [{ title: 'Movie1' }], count: 1 });

    await getUserMovie(req, res);

    expect(Movie.findAndCountAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ movies: expect.any(Array), hasMore: false }));
  });

  // ===================== getallMovies =====================
  it('should get all movies', async () => {
    Movie.findAndCountAll.mockResolvedValue({ rows: [{ title: 'Movie1' }], count: 1 });

    await getallMovies(req, res);

    expect(Movie.findAndCountAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ movies: expect.any(Array), hasMore: false }));
  });
});
