'use strict';

var moment = require('moment');
var winston = require('winston');

function addLogger(loggingConfigItem) {
  // Adding logger from config
  // Note: winston logger transport functions are anonymous, so transportFunctionName below will be blank for those.
  winston.info('Adding logger:', { transportFunctionName: loggingConfigItem.transport.name, options: loggingConfigItem.options });
  winston.add(loggingConfigItem.transport, loggingConfigItem.options);
}

function getTimestamp() {
  return moment().format('YYYY-MM-DD HH:MM:SS');
}

module.exports = function (config) {

  winston.remove(winston.transports.Console);

  // Log to console in local timezone.
  winston.add(winston.transports.Console, { timestamp: getTimestamp, colorize: true, silent: config.isTest });

  var loggingConfig = config.logging || [];
  loggingConfig.forEach(addLogger);

  return winston;
};