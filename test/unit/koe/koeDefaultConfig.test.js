'use strict';

var chai = require('chai');
var expect = chai.expect;
var rewire = require('rewire');
var koeDefaultConfig = require('../../../koe/koeDefaultConfig');

var requiredKeys = ['static', 'handlebars', 'cookieSecret', 'sessionSecret', 'secure', 'dev', 'livereload', 'minify', 'port', 'portHttps', 'routesDir'];
var requiredStaticKeys = ['baseDir', 'componentsDir', 'bindingsDir'];
var requiredHandlebarsKeys = ['defaultLayout', 'extname', 'viewsDir', 'layoutsDir', 'partialsDir'];

describe('the koe default config', function () {
  it('should set the bare minimum required properties', function () {

    expect(koeDefaultConfig).to.contain.all.keys(requiredKeys);
    expect(koeDefaultConfig.static).to.contain.all.keys(requiredStaticKeys);
    expect(koeDefaultConfig.handlebars).to.contain.all.keys(requiredHandlebarsKeys);
  });

  describe('if we are not in dev', function () {
    var env;
    before(function () {
      env = process.env.NODE_ENV;

      process.env.NODE_ENV = 'dummy';
    });

    after(function () {
      process.env.NODE_ENV = env;
    });

    it('should use a randomly-generated cookie secret if we are not in dev', function () {
      var nonDevConfig = rewire('../../../koe/koeDefaultConfig'); // rewire gets a new instance

      expect(koeDefaultConfig.cookieSecret).not.to.equal(nonDevConfig.cookieSecret);
      expect(nonDevConfig.cookieSecret).to.match(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/);
    });

    it('should use a randomly-generated session secret if we are not in dev', function () {
      var nonDevConfig = rewire('../../../koe/koeDefaultConfig'); // rewire gets a new instance

      expect(koeDefaultConfig.sessionSecret).not.to.equal(nonDevConfig.sessionSecret);
      expect(nonDevConfig.sessionSecret).to.match(/\w{8}-\w{4}-\w{4}-\w{4}-\w{12}/);
    });
  });
});