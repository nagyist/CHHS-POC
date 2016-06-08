var randomObject = require('../../../utils/randomObject');

var randomConfig = randomObject.newInstance('simpleConfig');

module.exports = {
  cookieSecret: randomConfig.set('cookieSecret'),
  testSecret: randomConfig.set('testSecret'),
  port: randomConfig.setInteger('port'),
  static: {
    baseDir: randomConfig.set('static.baseDir')
  },
  owAuth: {
    authMethod: randomConfig.set('owAuth.authMethod'),
    users: [randomConfig.set('dummy.user1'), randomConfig.set('dummy.user2')]
  }
};