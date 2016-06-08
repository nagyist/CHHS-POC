'use strict';

var _ = require('lodash');

module.exports = function (owAuthConfig, paths) {
  var authFolder = './ow-auth-' + owAuthConfig.authMethod + '/';

  function loadModule(name) {
    var module = require(authFolder + name); // eslint-disable-line global-require
    return module(owAuthConfig, paths);
  }

  var modules = _.reduce(['passport', 'ensureAuthenticated', 'routes'], function (mods, name) {
    mods[name] = loadModule(name);
    return mods;
  }, {});

  return {
    initialize: function () {
      return [modules.passport.initialize(), modules.passport.session(), modules.ensureAuthenticated, modules.routes];
    }
  };
};