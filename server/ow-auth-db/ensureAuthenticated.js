'use strict';
module.exports = function(owAuthConfig, paths) {
  function ensureAuthenticated(req, res, next) {

    if (req.isAuthenticated() || paths.public.indexOf(req.path) !== -1) {
      return next();
    }
    res.redirect('/login?returnUrl=' + encodeURIComponent(req.originalUrl));
  }

  return ensureAuthenticated;
};
