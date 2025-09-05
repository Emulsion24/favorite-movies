const express =require("express")
const router = express.Router();
const upload = require("../config/multer");
const { createMovie, getallMovies,deleteMovie,updateMovie,getMovie,updateMovieStatus,getUserMovie} = require('../controllers/movieController.js');
const { authMiddleware ,adminMiddleware} = require('../middlewares/authMiddleware');





router.post('/create', authMiddleware,upload.single("image"),createMovie);
router.get('/', authMiddleware,getMovie);
router.get('/user', authMiddleware,getUserMovie);
router.get('/all', adminMiddleware,getallMovies);
router.delete('/:id',authMiddleware,deleteMovie);
router.put('/:id',authMiddleware,upload.single("image"),updateMovie);
router.patch("/:id/status", adminMiddleware, updateMovieStatus );

module.exports = router;
