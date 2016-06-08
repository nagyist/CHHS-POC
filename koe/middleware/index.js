'use strict';

// This collates all references to standard KOE middleware, with appropriate configurability
var spoofSecureConnection = require('./spoofSecureConnection');
var helmet = require('./helmet');
var cookieParser = require('./cookieParser');
var bodyParser = require('./bodyParser');
var session = require('./session');
var flash = require('./flash');
var templateData = require('./templateData');
var staticContent = require('./staticContent');

module.exports = function (config) {
  return {
    spoofSecureConnection: spoofSecureConnection(config),
    helmet: helmet(config),
    cookieParser: cookieParser(config),
    bodyParser: bodyParser(config),
    session: session(config),
    flash: flash(config),
    templateData: templateData(config),
    staticContent: staticContent(config)
  };
};
