/**
 * Main application startup file
 */
'use strict';

// This loads env vars from a local ".env" file, for local development.
require('dotenv').config();

// Check for required environment vars:
if (!process.env.MAPBOX_ACCESS_TOKEN) throw new Error('Missing "MAPBOX_ACCESS_TOKEN" env var');

// NOTE: Usually setting globals is a bad idea. In this case it probably makes sense.
// This var must also be in .eslintrc's "globals" section.
var koe = global.koe = require('../koe');

// It probably also makes sense to make the logger global given that console.log is already global.
var logger = global.logger = koe.logger;

if (koe.config.newRelic) {
  require('newrelic'); // eslint-disable-line global-require
}

var express = require('express');
var https = require('https');
var session = require('./session');

var app = express();

// Setup handlebars
app.set('views', koe.config.handlebars.viewsDir);
app.engine('.hbs', koe.app.handlebarsRenderingEngine);
app.set('view engine', '.hbs');

// Load middleware
app.use(koe.middleware.spoofSecureConnection); // Express-session incorrectly determines that we are on a non-https connection so we need to flag it as secure ourselves
app.use(koe.middleware.helmet);
app.use(koe.middleware.staticContent);
app.use(koe.middleware.cookieParser);
app.use(koe.middleware.bodyParser);
app.use(session());
app.use(koe.middleware.flash);
app.use(koe.middleware.templateData);

app.use(koe.auth.initialize());

// Load routes (must come after middleware)
app.use(koe.utils.autoconfigureRoutes(koe.config.routesDir, logger));

// Load error handlers (must come last)
app.use(koe.errorHandling.defaultErrorHandler);

// Start app
var server = app.listen(koe.config.port, function () {
  var host = server.address().address;
  var port = server.address().port;
  logger.info('Express server listening at http://%s:%s', host, port);
});

// Optionally - start server (HTTPS)
if (koe.app.sslCredentials) {
  // Server on PORT_HTTPS
  var serverHttps = https.createServer(koe.app.sslCredentials, app).listen(koe.config.portHttps, function () {
    var host = serverHttps.address().address;
    logger.info('Express server listening on host "%s", port %s (HTTPS)', host, koe.config.portHttps);
  });
}

module.exports = app;
