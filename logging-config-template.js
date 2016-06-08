// Copy this file to "logging-config.js" in the root folder.

var path = require('path');
var winston = require('winston');

module.exports = [
  {
    transport: winston.transports.File,
    options: {
      filename: path.join(__dirname, './server/logs/winston.log'),
      maxsize: 10 * 1048576, // 10MB
      maxFiles: 10,
      tailable: true, // if true, the main log file will have the latest logs.  The previous log file will have suffix "1", next oldest "2", and so on.
    }
  }
];
