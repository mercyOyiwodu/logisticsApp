require('dotenv').config()
const passport = require('passport');
const userModel = require('../models/userModel');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4940/api/v1/auth/google"
  },
  function(accessToken, refreshToken, profile, cb) {
    userModel.findOne({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));