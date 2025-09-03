const { Movie, User } = require('../models');

// Get all pending movies
exports.getPendingMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll({ where: { approved: false } });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve a movie
exports.approveMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByPk(id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });

    movie.approved = true;
    await movie.save();

    res.json({ message: 'Movie approved successfully', movie });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role'] });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
