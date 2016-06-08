var passport = require('passport');
var localStrategy = require('passport-local');
var db = require('../../db');

module.exports = function () {

  var strategy = new localStrategy(
    { passReqToCallback: true },
    function (req, username, password, done) {
      return db.connect().then(function (database) {
        return database.collection('users').find({ username: username }).toArray();
      }).then(function (users) {
        if (users.length) {
          logger.info('User successfully authenticated', { username: username });
          return done(null, users[0]);
        }
        logger.error('User not found for username', { username: username });
        return done(null, false, req.flash('warning', 'Invalid username. Are you registered?'));
      });
    }
  );

  passport.serializeUser(function (user, done) {
    done(null, JSON.stringify(user));
  });

  passport.deserializeUser(function (userString, done) {
    done(null, JSON.parse(userString));
  });

  passport.use(strategy);

  return passport;
};
