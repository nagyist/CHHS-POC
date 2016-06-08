'use strict';
var express = require('express');
var router = express.Router();

module.exports = function() {

  router.get('/login', function(req, res) {
    res.redirect('/');
  });

  router.get('/logout', function(req, res) {
    res.redirect('/');
  });

  return router;
};
