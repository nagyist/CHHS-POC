'use strict';

var _ = require('lodash');

module.exports = function errorDetails(err) {
  var details;
  if (_.isObject(err)) {
    details = {
      name: err.name,
      message: err.message,
      stack: err.stack
    };
  } else {
    details = {
      message: err.toString()
    };
  }

  return JSON.stringify(details, null, 4);
};
