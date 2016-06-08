'use strict';

var ensureAuthenticated = require('./ensureAuthenticated');
var passport = require('./passport');
var routes = require('./routes');

module.exports = function (owAuthConfig, paths) {
  var pp = passport(owAuthConfig, paths);
  var rts = routes(owAuthConfig, paths);
  var ea = ensureAuthenticated(owAuthConfig, paths);

  return {
    initialize: function () {
      return [pp.initialize(), pp.session(), ea, rts];
    }
  };
};
