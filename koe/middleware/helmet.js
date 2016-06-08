'use strict';

var helmet = require('helmet');

// Set the x-frame-options header to prevent clickjacking. See https://github.com/helmetjs/frameguard
module.exports = function () {
  return helmet.frameguard('deny');
};
