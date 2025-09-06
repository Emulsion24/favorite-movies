// src/server.js
const db  = require('./models/index')

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Import routes
const indexRoutes = require('./routes/index');
const movieRoutes = require('./routes/movieRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// -----------------
// Security
// -----------------
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://movie-thumbnail.s3.us-east-1.amazonaws.com"],
    },
  })
);

// -----------------
// CORS
// -----------------
app.use(cors({
  origin: "https://favorite-movies-kia6.onrender.com", // Change this in production to your domain
  credentials: true
}));

// -----------------
// Request parsing & Cookies
// -----------------
app.use(express.json());
app.use(cookieParser());

// -----------------
// Logging
// -----------------
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'access.log'),
  { flags: 'a' }
);
app.use(morgan('dev'));
app.use(morgan('combined', { stream: accessLogStream }));

// -----------------
// Rate Limiting
// -----------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { status: 429, message: "Too many requests, please try again later." }
});
app.use(limiter);

// -----------------
// API Routes
// -----------------
app.use('/api/v1', indexRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/admin', adminRoutes);

// -----------------
// Serve React frontend
// -----------------
const buildPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(buildPath));

// Fallback route: any non-API request goes to React
app.all(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// -----------------
// Health check
// -----------------
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// -----------------
// Start server
// -----------------
(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
