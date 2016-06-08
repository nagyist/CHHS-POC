'use strict';

var _ = require('lodash');
var chai = require('chai');
var path = require('path');
var fs = require('fs');
var rewire = require('rewire');

var requireRoot = require('../../../koe/utils/requireRoot');
var nonStrictEquality = require('../../utils/nonStrictEquality');
chai.use(nonStrictEquality);

var randomObject = require('../../utils/randomObject');

var expect = chai.expect;

var config = rewire('../../../koe/config');
var defaultConfig = require('../../../koe/koeDefaultConfig');


describe('the koe config module', function () {

  before(function () {
    config.__set__('configEnv', 'blank');
  });

  after(function () {
    requireRoot.setTestMode(false);
  });

  it('should contain the default config if no overrides are present', function () {
    var emptyDir = path.resolve(__dirname, '../../fixtures/config/empty');

    if (!fs.existsSync(emptyDir)){
      fs.mkdirSync(emptyDir);
    }

    requireRoot.setTestMode('../../test/fixtures/config/empty');

    expect(config()).to.be.superObjectOf(defaultConfig);
  });

  it('should add the current environment to the exported config', function () {
    var conf = config();
    expect(conf).to.contain.key('environment');
    expect(conf.environment).to.equal('blank');
  });

  describe('when we have a simple config.js override', function () {
    it('should merge the config over the default config', function () {
      requireRoot.setTestMode('../../test/fixtures/config/simple');

      var conf = config();
      expect(conf).not.to.be.superObjectOf(defaultConfig);

      var changedKeys = ['cookieSecret', 'testSecret', 'port', 'static', 'environment', 'owAuth'];

      // Iterate over the keys we expect to stay the same
      _.each(conf, function (val, k) {
        if (!_.includes(changedKeys, k)) {
          expect(val).to.be.nonStrictEqual(defaultConfig[k]);
        }
      });

      // We have one changed property on the static nested object
      _.each(conf.static, function (val, k) {
        if (k !== 'baseDir') {
          expect(val).to.be.nonStrictEqual(defaultConfig.static[k]);
        }
      });

      var fixtures = randomObject.instance('simpleConfig');

      // And we have added an owAuth object
      expect(conf.owAuth).to.be.an('object');
      fixtures.verify('owAuth.authMethod', conf.owAuth.authMethod);
      expect(conf.owAuth.users).to.be.an('array');
      expect(conf.owAuth.users).to.be.nonStrictEqual([fixtures.get('dummy.user1'), fixtures.get('dummy.user2')]);

      // verify that our changed keys are as we expect

      fixtures.verify('cookieSecret', conf.cookieSecret);
      fixtures.verify('testSecret', conf.testSecret);
      fixtures.verify('port', conf.port);
      fixtures.verify('static.baseDir', conf.static.baseDir);
    });
  });

  describe('when we have a base config and environment-specific overrides', function () {
    before(function () {
      requireRoot.setTestMode('../../test/fixtures/config/env');
    });

    it('should merge baseconfig over the top of the default config before applying environment-specific config', function () {

      var conf = config();
      expect(conf).not.to.be.superObjectOf(defaultConfig);

      var changedKeys = ['routesDir', 'newSecret', 'port', 'handlebars', 'environment'];

      // Iterate over the keys we expect to stay the same
      _.each(conf, function (val, k) {
        if (!_.includes(changedKeys, k)) {
          expect(val).to.be.nonStrictEqual(defaultConfig[k]);
        }
      });

      // We have one changed property on the handlebars nested object
      _.each(conf.handlebars, function (val, k) {
        if (k !== 'defaultLayout') {
          expect(val).to.be.nonStrictEqual(defaultConfig.handlebars[k]);
        }
      });

      // verify that our changed keys are as we expect

      var fixtures = randomObject.instance('envConfig');

      fixtures.verify('baseConfig.routesDir', conf.routesDir);
      fixtures.verify('baseConfig.newSecret', conf.newSecret);
      fixtures.verify('baseConfig.port', conf.port);
      fixtures.verify('baseConfig.handlebars.defaultLayout', conf.handlebars.defaultLayout);
    });

    it('should put environment-specific overrides on top of that', function () {
      var conf;
      config.__with__('configEnv', 'test')(function () {
        conf = config();
      });

      expect(conf).not.to.be.superObjectOf(defaultConfig);

      var changedKeys = ['routesDir', 'newSecret', 'totallyNewSecret', 'port', 'handlebars', 'environment'];

      // Iterate over the keys we expect to stay the same
      _.each(conf, function (val, k) {
        if (!_.includes(changedKeys, k)) {
          expect(val).to.be.nonStrictEqual(defaultConfig[k]);
        }
      });

      // We have one changed property on the handlebars nested object
      _.each(conf.handlebars, function (val, k) {
        if (k !== 'defaultLayout' && k !== 'extname') {
          expect(val).to.be.nonStrictEqual(defaultConfig.handlebars[k]);
        }
      });

      // verify that our changed keys are as we expect

      var fixtures = randomObject.instance('envConfig');

      fixtures.verify('environments.test.routesDir', conf.routesDir);
      fixtures.verify('environments.test.newSecret', conf.newSecret);
      fixtures.verify('environments.test.totallyNewSecret', conf.totallyNewSecret);
      fixtures.verify('baseConfig.port', conf.port);
      fixtures.verify('baseConfig.handlebars.defaultLayout', conf.handlebars.defaultLayout);
      fixtures.verify('environments.test.handlebars.extname', conf.handlebars.extname);
    });
  });
  
  describe('when we have a base config, environment-specific overrides, and an [env].json file', function () {
    var randomJsonFile;

    before(function () {
      requireRoot.setTestMode('../../test/fixtures/config/env_json');

      randomJsonFile = randomObject.newInstance('jsonConfig');

      var jsonConfig = {
        sessionSecret: randomJsonFile.set('json.sessionSecret'),
        somethingSecret: randomJsonFile.set('json.somethingSecret'),
        ssl: {
          certificatePath: randomJsonFile.set('json.ssl.certificatePath')
        }
      };

      fs.writeFileSync(path.resolve(__dirname, '../../fixtures/config/env_json/test.json'), JSON.stringify(jsonConfig));
    });

    after(function () {
      fs.unlinkSync(path.resolve(__dirname, '../../fixtures/config/env_json/test.json'));
    });
    
    it('should merge the json file over the already-overridden config', function () {
      var conf;
      config.__with__('configEnv', 'test')(function () {
        conf = config();
      });

      expect(conf).not.to.be.superObjectOf(defaultConfig);

      var changedKeys = ['cookieSecret', 'sessionSecret', 'somethingSecret', 'ssl', 'routesDir', 'environment'];

      // Iterate over the keys we expect to stay the same
      _.each(conf, function (val, k) {
        if (!_.includes(changedKeys, k)) {
          expect(val).to.be.nonStrictEqual(defaultConfig[k]);
        }
      });

      // verify that our changed keys are as we expect

      var fixtures = randomObject.instance('envJsonConfig');

      fixtures.verify('environments.test.routesDir', conf.routesDir);
      fixtures.verify('baseConfig.cookieSecret', conf.cookieSecret);
      randomJsonFile.verify('json.sessionSecret', conf.sessionSecret);
      randomJsonFile.verify('json.somethingSecret', conf.somethingSecret);
      fixtures.verify('baseConfig.ssl.privateKeyPath', conf.ssl.privateKeyPath);
      randomJsonFile.verify('json.ssl.certificatePath', conf.ssl.certificatePath);
    });
  });

  describe('when we have a base config, environment-specific overrides, an [env].json file and environment variables', function () {
    var randomJsonFile;

    before(function () {
      requireRoot.setTestMode('../../test/fixtures/config/env_vars');

      randomJsonFile = randomObject.newInstance('jsonConfig');

      var jsonConfig = {
        sessionSecret: randomJsonFile.set('json.sessionSecret'),
        somethingSecret: randomJsonFile.set('json.somethingSecret'),
        ssl: {
          certificatePath: randomJsonFile.set('json.ssl.certificatePath')
        }
      };

      fs.writeFileSync(path.resolve(__dirname, '../../fixtures/config/env_vars/test.json'), JSON.stringify(jsonConfig));
    });

    after(function () {
      fs.unlinkSync(path.resolve(__dirname, '../../fixtures/config/env_vars/test.json'));
    });

    it('should apply the environment vars over the top of the merged config', function () {
      var conf;
      var randomEnvironment = randomObject.newInstance('environmentVariableConfig');

      process.env.SESSION_SECRET = randomEnvironment.set('sessionSecret');
      process.env.SSL_PRIVATE_KEY_PATH = randomEnvironment.set('ssl.privateKeyPath');

      config.__with__('configEnv', 'test')(function () {
        conf = config();
      });

      expect(conf).not.to.be.superObjectOf(defaultConfig);

      var changedKeys = ['cookieSecret', 'sessionSecret', 'somethingSecret', 'ssl', 'routesDir', 'environment'];

      // Iterate over the keys we expect to stay the same
      _.each(conf, function (val, k) {
        if (!_.includes(changedKeys, k)) {
          expect(val).to.be.nonStrictEqual(defaultConfig[k]);
        }
      });

      // verify that our changed keys are as we expect

      var fixtures = randomObject.instance('envVarsConfig');

      fixtures.verify('environments.test.routesDir', conf.routesDir);
      fixtures.verify('baseConfig.cookieSecret', conf.cookieSecret);
      randomEnvironment.verify('sessionSecret', conf.sessionSecret);
      randomJsonFile.verify('json.somethingSecret', conf.somethingSecret);
      randomEnvironment.verify('ssl.privateKeyPath', conf.ssl.privateKeyPath);
      randomJsonFile.verify('json.ssl.certificatePath', conf.ssl.certificatePath);
    });
  });
});