var randomObject = require('../../../utils/randomObject');

var randomConfig = randomObject.newInstance('envConfig');

module.exports = {
  baseConfig: {
    routesDir: randomConfig.set('baseConfig.routesDir'),
    newSecret: randomConfig.set('baseConfig.newSecret'),
    port: randomConfig.setInteger('baseConfig.port'),
    handlebars: {
      defaultLayout: randomConfig.set('baseConfig.handlebars.defaultLayout')
    }
  },
  environments: {
    test: {
      routesDir: randomConfig.set('environments.test.routesDir'),
      newSecret: randomConfig.set('environments.test.newSecret'),
      totallyNewSecret: randomConfig.set('environments.test.totallyNewSecret'),
      handlebars: {
        extname: randomConfig.set('environments.test.handlebars.extname')
      }
    }
  }
};