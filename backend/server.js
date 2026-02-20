const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Sabse pehle dotenv load karo taaki baaki files ko variables mil sakein
dotenv.config(); 

const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/db');

// 2. Ab passport load karo kyunki ab isko .env mil chuka hai
require('./config/passport'); 

// Connect to MongoDB
connectDB();

const app = express();
// ... baaki ka code ekdum sahi hai

// ── Middleware ─────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 },
}));

app.use(passport.initialize());
app.use(passport.session());

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders',   require('./routes/orderRoutes'));
app.use('/api/users',    require('./routes/userRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🚀 VELOUR API is running', db: 'ecommerce_db' });
});

// ── Error Handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Database: ecommerce_db`);
});
