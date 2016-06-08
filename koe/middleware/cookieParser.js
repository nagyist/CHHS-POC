'use strict';

var cookieParser = require('cookie-parser');

module.exports = function (config) {
  return cookieParser(config.cookieSecret);
};
