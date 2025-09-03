const express = require('express');
const router = express.Router();
const { getPendingMovies, approveMovie, getUsers } = require('../controllers/adminController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { adminMiddleware } = require('../middlewares/authMiddleware');

// Only admins can access
router.get('/movies/pending', authMiddleware, adminMiddleware, getPendingMovies);
router.put('/movies/approve/:id', authMiddleware, adminMiddleware, approveMovie);
router.get('/users', authMiddleware, adminMiddleware, getUsers);

module.exports = router;
