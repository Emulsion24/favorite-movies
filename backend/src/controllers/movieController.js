// controllers/movieController.js
const { Op } = require("sequelize");
const {movieSchema}=require("../validation/movieValidation")
const { Movie } = require("../models");

/**
 * Create a new movie/TV show (user submission)
 * - Default: approved = false
 */
exports.createMovie = async (req, res) => {
  try {
    const { title, type, director, budget, location, duration, year } = movieSchema.parse({ ...req.body });
    const userId = req.user.id; // comes from auth middleware


    // If image uploaded with multer
    
    const image_url = req.file ? req.file.location : null;
      
    const movie = await Movie.create({

      title,
      type,
      director,
      budget,
      location,
      duration,
      year,
      image:image_url,
      userId: userId,
      approved: false,
    });

    res.status(201).json({
      message: "Movie/TV Show submitted (pending approval)",
      movie,
    });
  } catch (err) {
    console.error(err)
    res.status(400).json({ error: err.message });
  }
};

/**
 * Get movies
 * - User sees ALL approved movies
 * - User also sees THEIR OWN pending movies
 * - Supports pagination, search, filter by type
 */
exports.getMovie = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {
      [Op.or]: [
        { status: "approved" },         // all approved movies
        { userId: req.user.id },   // user’s own entries, even if pending
      ],
    };

    if (type) where.type = type;
    if (search) where.title = { [Op.iLike]: `%${search}%` };

    const { rows, count } = await Movie.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    res.json({
      movies: rows,
      hasMore: count > offset + rows.length,
    });
  } catch (err) {
   console.error(err); 
    res.status(500).json({ error: err.message });
    
  }
};

/**
 * Update movie
 * - Only owner can edit
 */
exports.updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ error: "Not found" });
console.log(req.user.role)
if(req.user.role!=='admin'){
    if (movie.userId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
  }

    const { title, type, director, budget, location, duration, year } = req.body;
    if (req.file) movie.image_url = `/uploads/${req.file.filename}`;

    await movie.update({
      title: title || movie.title,
      type: type || movie.type,
      director: director || movie.director,
      budget: budget || movie.budget,
      location: location || movie.location,
      duration: duration || movie.duration,
      year: year || movie.year,
      image_url: movie.image_url,
      status:"pending"
       // editing should reset approval
    });

    res.json({ message: "Movie updated (pending re-approval)", movie });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Delete movie
 * - Only owner can delete
 */
exports.deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).json({ error: "Not found" });

    if (movie.userId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    await movie.destroy();
    res.json({ message: "Movie deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateMovieStatus = async (req, res) => {
  try {
    const movieId = req.params.id;
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const movie = await Movie.findByPk(movieId);
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    movie.status = status;
    await movie.save();

    res.status(200).json({
      message: `Movie status updated to ${status}`,
      movie
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getMovies = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, search } = req.query;
    const offset = (page - 1) * limit;

    // Fetch all movies that are NOT rejected
    const where = {
      status: { [Op.ne]: "rejected" }, // not rejected
    };

    if (type) where.type = type;
    if (search) where.title = { [Op.iLike]: `%${search}%` };

    const { rows, count } = await Movie.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    res.json({
      movies: rows,
      hasMore: count > offset + rows.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};