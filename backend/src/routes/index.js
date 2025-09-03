const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');

router.use('/auth', authRoutes);
router.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

module.exports = router;
