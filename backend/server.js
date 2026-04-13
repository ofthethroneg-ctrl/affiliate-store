require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const analyticsRoutes = require('./routes/analytics.routes');

const app = express();

// Security
app.use(helmet());
app.use(morgan('dev'));

// Rate limit
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

// ✅ FIXED CORS (FINAL)
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL, // 🔥 your vercel URL
  ],
  credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ SERVE STATIC IMAGES (IMPORTANT)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Root route (optional)
app.get('/', (req, res) => {
  res.send('🚀 ShopElite Backend Running');
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Mongo connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Mongo error:', err.message);
    process.exit(1);
  });

module.exports = app;