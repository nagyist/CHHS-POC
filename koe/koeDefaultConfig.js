'use strict';

var path = require('path');
var uuid = require('node-uuid');

// Lots of things are flagged by whether we are in the dev environment so set a convenient flag
var isDev = process.env.NODE_ENV === 'dev';

var defaultConfig = {
  dev: isDev,
  livereload: false,
  secure: !isDev,
  errorDebug: isDev,
  minify: false,
  cookieSecret: isDev ? 'secret' : uuid.v4(),
  sessionSecret: isDev ? 'secret' : uuid.v4(),
  static: {
    baseDir: path.resolve(__dirname, '../client'),
    componentsDir: path.resolve(__dirname, '../client/components'),
    bindingsDir: path.resolve(__dirname, '../client/bindings')
  },
  routesDir: path.resolve(__dirname, '../server/routes'),
  handlebars: {
    defaultLayout: 'main',
    extname: '.hbs',
    viewsDir: path.resolve(__dirname, '../server/views'),
    layoutsDir: path.resolve(__dirname, '../server/views/layouts'),
    partialsDir: path.resolve(__dirname, '../server/views/partials')
  },
  status: {
    integrationsDir: path.resolve(__dirname, '../server/status')
  },
  ssl: {
    privateKeyPath: path.resolve(__dirname, '../server/ssl/private_key.pem'),
    certificatePath: path.resolve(__dirname, '../server/ssl/ca_certificate.pem')
  },
  port: 9001,
  portHttps: undefined
};

module.exports = defaultConfig;