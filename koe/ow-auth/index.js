// Uses application config to determine which auth mechanism to use.
// Returns passport/routes/etc that correspond to the selected mechanism.

'use strict';
var assert = require('assert');
var _ = require('lodash');
var requireRoot = require('../utils/requireRoot');
var loadStandardAuth = require('./loadAuth');

function loadCustomAuth(owAuthConfig, paths) {
  assert(!!owAuthConfig.authLocation, 'Missing owAuthConfig.authLocation for custom auth');
  var auth = require(owAuthConfig.authLocation);  // eslint-disable-line global-require
  return auth(owAuthConfig, paths);
}

function loadAuthModules(owAuthConfig, paths) {
  var load = owAuthConfig.authMethod === 'custom' ? loadCustomAuth : loadStandardAuth;
  return load(owAuthConfig, paths);
}

function processConfig(config) {
  var owAuthConfig = config.owAuth;

  if (!owAuthConfig && config.dev) {
    // For dev environments, default to authType 'none'
    owAuthConfig = {
      authMethod: 'none'
    };
  }

  if (!owAuthConfig) {
    // Not on dev environment, missing auth config.
    throw new Error('OW Auth has not been configured, you must add this to the application config first. ' +
      'See ow-auth-config.md for more info.');
  }

  assert(!!owAuthConfig.authMethod, 'Missing owAuthConfig.authMethod');

  assert(_.includes(['none', 'custom'], owAuthConfig.authMethod), 'Unknown authMethod: "' + owAuthConfig.authMethod + '"');

  return owAuthConfig;
}

module.exports = function (config, logger) {
  var owAuthConfig = processConfig(config);
  var paths = requireRoot('paths.json'); // used to specify which paths are public

  return {
    initialize: function () {
      logger.info('Using owAuthConfig.authMethod:', owAuthConfig.authMethod);

      // We don't want to load the auth modules until this point so as to avoid circular dependencies on config
      var auth = loadAuthModules(owAuthConfig, paths);

      return auth.initialize();
    }
  };
};
