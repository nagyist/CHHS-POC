'use strict';

var bodyParser = require('body-parser');

module.exports = function () {
  return bodyParser.urlencoded({
    extended: true
  });
};
