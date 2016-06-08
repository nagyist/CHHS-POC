'use strict';

var appInfo = require('./appInfo');
var componentsAndBindings = require('./componentsAndBindings');
var handlebarsRenderingEngine = require('./handlebarsRenderingEngine');
var sslCredentials = require('./sslCredentials');
var status = require('./status');

module.exports = function (config) {
  return {
    appInfo: appInfo(config),
    componentsAndBindings: componentsAndBindings(config),
    handlebarsRenderingEngine: handlebarsRenderingEngine(config),
    sslCredentials: sslCredentials(config),
    status: status(config)
  };
};
