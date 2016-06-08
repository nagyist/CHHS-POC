'use strict';

// This is the koe god object, exposing various utilities which may or may not be required elsewhere in the application.
// Ideally it should not be edited in individual projects, instead being readily updated by syncing with the original 
// fork.

var configModule = require('./config');
var loggingModule = require('./logger');
var authModule = require('./ow-auth');

var app = require('./app');
var middleware = require('./middleware');
var errorHandling = require('./errorHandling');
var utils = require('./utils');

module.exports = function () {
  var config = configModule();
  var logger = loggingModule(config);
  var auth = authModule(config, logger);

  return {
    app: app(config),
    middleware: middleware(config),
    errorHandling: errorHandling(config, logger),
    utils: utils,
    config: config,
    logger: logger,
    auth: auth
  };
};
