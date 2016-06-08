'use strict';

var defaultErrorHandler = require('./defaultErrorHandler');
var errorDetails = require('./errorDetails');

module.exports = function (config, logger) {
  return {
    defaultErrorHandler: defaultErrorHandler(config, logger),
    errorDetails: errorDetails
  };
};
