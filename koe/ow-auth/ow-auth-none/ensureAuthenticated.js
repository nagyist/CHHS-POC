'use strict';
module.exports = function() {
  function ensureAuthenticated(req, res, next) {
    return next();
  }
  return ensureAuthenticated;
};
