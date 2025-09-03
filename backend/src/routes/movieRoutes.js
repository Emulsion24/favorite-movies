const express = require('express');
const router = express.Router();
const { createMovie, getMovies } = require('../controllers/movieController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, createMovie);
router.get('/', getMovies);

module.exports = router;
