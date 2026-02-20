const jwt      = require('jsonwebtoken');
const passport = require('passport');
const User     = require('../models/User');

// ── Generate JWT ─────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });

// ── @route   POST /api/auth/register ─────────────────────────
const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    token: generateToken(user._id),
    user: {
      _id:            user._id,
      name:           user.name,
      email:          user.email,
      role:           user.role,
      profilePicture: user.profilePicture,
    },
  });
};

// ── @route   POST /api/auth/login ────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.password) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: {
      _id:            user._id,
      name:           user.name,
      email:          user.email,
      role:           user.role,
      profilePicture: user.profilePicture,
    },
  });
};

// ── @route   GET /api/auth/google ────────────────────────────
const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

// ── @route   GET /api/auth/google/callback ───────────────────
const googleCallback = (req, res) => {
  const token = generateToken(req.user._id);
  // Redirect to frontend with token in query param
  res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
};

// ── @route   GET /api/auth/me ────────────────────────────────
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, user });
};

module.exports = { register, login, googleAuth, googleCallback, getMe };
