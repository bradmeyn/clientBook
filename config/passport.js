const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

// Load User model
const User = require('../models/user_model');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      //find user
      await User.findOne({
        username,
      }).then((user) => {
        if (!user) {
          return done(null, false, {
            message: 'Username and/or password is invalid',
          });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, match) => {
          if (err) throw err;
          if (match) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: 'Username and/or password is invalid',
            });
          }
        });
      });
    })
  );

  passport.serializeUser(function (user, done) {
    console.log('serialising');
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    console.log('deserialising');
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
