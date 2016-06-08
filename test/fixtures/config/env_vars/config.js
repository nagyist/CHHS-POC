var fs = require('fs');

var randomObject = require('../../../utils/randomObject');

var randomConfig = randomObject.instance('envVarsConfig');

module.exports = {
  baseConfig: {
    cookieSecret: randomConfig.set('baseConfig.cookieSecret'),
    sessionSecret: randomConfig.set('baseConfig.sessionSecret'),
    somethingSecret: randomConfig.set('baseConfig.somethingSecret'),
    routesDir: randomConfig.set('baseConfig.routesDir'),
    ssl: {
      privateKeyPath: randomConfig.set('baseConfig.ssl.privateKeyPath')
    }
  },
  environments: {
    test: {
      sessionSecret: randomConfig.set('environments.test.sessionSecret'),
      somethingSecret: randomConfig.set('environments.test.somethingSecret'),
      routesDir: randomConfig.set('environments.test.routesDir')
    }
  }
};