'use strict';

var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
  res.json({
    MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN
  });
});

module.exports = router;