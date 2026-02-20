const express  = require('express');
const passport = require('passport');
const router   = express.Router();
const { register, login, googleAuth, googleCallback, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login',    login);
router.get('/me',        protect, getMe);

// Google OAuth
router.get('/google',          googleAuth);
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed` }),
  googleCallback
);

module.exports = router;
