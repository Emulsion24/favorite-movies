const { Movie } = require('../models');

exports.createMovie = async (req, res) => {
  try {
    const { title, type, director, budget, location, duration, year, image } = req.body;
    const movie = await Movie.create({
      title,
      type,
      director,
      budget,
      location,
      duration,
      year,
      image,
      approved: false, // always false until admin approves
      userId: req.user.id, // from JWT
    });
    res.status(201).json({ message: 'Movie submitted for approval', movie });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.findAll({ where: { approved: true } });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
