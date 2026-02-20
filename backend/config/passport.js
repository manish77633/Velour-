const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Aisa hona chahiye
callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // Create new user from Google profile
          user = await User.create({
            name:           profile.displayName,
            email:          profile.emails[0].value,
            profilePicture: profile.photos[0]?.value || '',
            googleId:       profile.id,
            isVerified:     true,
          });
          console.log(`✅ New Google user created: ${user.email}`);
        } else if (!user.googleId) {
          // Link Google account to existing user
          user.googleId       = profile.id;
          user.profilePicture = profile.photos[0]?.value || user.profilePicture;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
