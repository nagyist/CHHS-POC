'use strict';

var session = require('express-session');
var uuid = require('node-uuid');

// Session setup
// NOTE: By default, this will use in-memory sessions.  Each time node is restarted, all sessions will be lost.
// That means every update to the site will log users out (since their session are gone).
// See file- and mongodb- backed sessions for better use.
module.exports = function (config) {
  return session({
    secret: config.sessionSecret,
    genid: function () {
      return uuid.v4();
    },
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: config.secure, // Cookie will not be set over HTTP, only HTTPS, for hosted sites. See https://github.com/expressjs/session#cookie-options
      httpOnly: true // do not allow client-side script access to the cookie (this option is named rather confusingly; it's unrelated to HTTP vs. HTTPS)
    }
  });
};
