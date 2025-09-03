const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const cookieParser = require('cookie-parser');



const routes = require('./routes');
const movieRoutes = require('./routes/movieRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(cookieParser());

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/v1', routes);

app.use('/api/movies', movieRoutes);
app.use('/api/admin', adminRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'API is running ' });
});

module.exports = app;
