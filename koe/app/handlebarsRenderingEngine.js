'use strict';

var handlebars = require('express-handlebars');
var _ = require('lodash');

var helpers = {
  json: JSON.stringify
};

module.exports = function (config) {
  var handlebarsConfig = _.merge(config.handlebars, { helpers: helpers });

  return handlebars(handlebarsConfig);
};
