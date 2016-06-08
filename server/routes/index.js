'use strict';

var express = require('express');
var router = express.Router();
var config = koe.config;
var _ = require('lodash');

/* CLIENT APPLICATION */
router.get('/', function (req, res) {
  logger.info('GET /');

  res.render('index', { defines: [{ name: 'currentuser', content: req.user }]});
});

router.use('/status', function (req, res) {
  koe.app.status.getUpDownStatus().then(function (result) {
    res.status(result ? 200 : 500).send();
  });
});

router.use('/api/status', function (req, res) {
  koe.app.status.getFullStatusInfo().then(function (statusChecks) {

    var result = _.merge({}, koe.app.appInfo, { statusChecks: statusChecks });

    res.send(result);
  });
});

router.use('/api/components', function (req, res) {
  res.send(koe.app.componentsAndBindings.findComponents(config.dev));
});

router.use('/api/bindings', function (req, res) {
  res.send(koe.app.componentsAndBindings.findBindings(config.dev));
});

router.use('/debug', function (req, res) {
  res.cookie('assets', 'debug', { signed: true, httpOnly: true, secure: config.secure });
  return res.redirect('/');
});

router.use('/minify', function (req, res) {
  res.cookie('assets', 'minify', { signed: true, httpOnly: true, secure: config.secure });
  return res.redirect('/');
});

module.exports = router;
