'use strict';

var path = require('path');

module.exports.baseConfig = {
  owAuth: {
    authMethod: 'custom',
    authLocation: path.resolve(__dirname, './server/ow-auth-db')
  },
  minify: false,
  mongodbUri: 'mongodb://localhost:27017/chhs-db'
};

module.exports.environments = {
  latestCommit: {
    newRelic: {
      appName: 'CHHS POC LatestCommit',
      logLevel: 'info'
    },
    minify: true
  },
  production: {
    newRelic: {
      appName: 'CHHS POC',
      logLevel: 'info'
    }
  }
};