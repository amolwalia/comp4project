require('dotenv').config();

const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');

const authRoutes = require('./routes/authRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(
  cors({
    origin: clientUrl,
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/wishlist', wishlistRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

