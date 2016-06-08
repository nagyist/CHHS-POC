'use strict';

var express = require('express');
var router = express.Router();

module.exports = function (config) {
  /* STATIC FILES */
  router.use(express.static(config.static.baseDir));

  return router;
};
