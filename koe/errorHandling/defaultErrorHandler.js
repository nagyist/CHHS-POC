'use strict';

var errorDetails = require('./errorDetails');

module.exports = function (config, logger) {
  return function defaultErrorHandler(err, req, res, next) {
    var details = errorDetails(err);
    logger.error('SERVER ERROR:');
    logger.error(details);

    res.status(err.status || 500);

    if (config.errorDebug) {
      // Debug error messages
      res.send(details);
    } else {
      // Prod error messages
      res.send('A server error has occurred.');
    }

    // call any further registered error handlers.
    next();
  };
};
