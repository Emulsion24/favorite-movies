const express = require('express');
const router = express.Router();
const upload = require("../config/multer");
const { createMovie, getMovies,deleteMovie,updateMovie,getMovie,updateMovieStatus  } = require('../controllers/movieController');
const { authMiddleware ,adminMiddleware} = require('../middlewares/authMiddleware');





router.post('/create', authMiddleware,upload.single("image"),createMovie);
router.get('/', authMiddleware,getMovie);
router.get('/all', adminMiddleware,getMovies);
router.delete('/:id',authMiddleware,deleteMovie);
router.put('/:id',authMiddleware,upload.single("image"),updateMovie);
router.patch("/:id/status", adminMiddleware, updateMovieStatus );

module.exports = router;
