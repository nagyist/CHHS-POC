'use strict';

var path = require('path');
var chai = require('chai');
var _ = require('lodash');

var randomObject = require('../../../utils/randomObject');
var nonStrictEquality = require('../../../utils/nonStrictEquality');
chai.use(nonStrictEquality);

var requireRoot = require('../../../../koe/utils/requireRoot');

var expect = chai.expect;

var appInfo = require('../../../../koe/app/appInfo');
var fixturesDir = path.resolve(__dirname, '../../../fixtures/appInfo');

var config = randomObject.newInstance();
config.set('static.baseDir', fixturesDir);
config.set('secret');
config.set('not.secret');

describe('the appInfo module', function () {
  var info;

  before(function () {
    requireRoot.setTestMode(fixturesDir);
    info = appInfo(config.getObject());
  });

  after(function () {
    requireRoot.setTestMode(false);
  });

  it('includes build information', function () {
    expect(info).to.include.key('fakeBuildProperties');
    expect(info.fakeBuildProperties).to.equal('yup');
  });

  it('includes app startup time', function () {
    expect(info).to.include.key('startupTime');
    expect(info.startupTime).to.be.a('date');
    // ten seconds leeway ought to be enough
    expect(info.startupTime.getTime()).to.be.closeTo((new Date()).getTime(), 20000);
  });

  it('includes server dependencies', function () {
    expect(info).to.include.key('serverDependencies');
    expect(info.serverDependencies).to.be.an('array').and.to.have.lengthOf(1);
    expect(info.serverDependencies[0]).to.be.nonStrictEqual({
      depname: 'batman',
      configuredVersion: 'michael keaton',
      installedVersion: 'christian bale'
    });
  });

  it('includes client dependencies', function () {
    expect(info).to.include.key('clientDependencies');
    expect(info.clientDependencies).to.be.an('array').and.to.have.lengthOf(1);
    expect(info.clientDependencies[0]).to.be.nonStrictEqual({
      depname: 'joker',
      configuredVersion: 'jack nicholson',
      installedVersion: 'heath ledger'
    });
  });

  it('includes flattened config', function () {
    expect(info).to.include.key('config');
    expect(info.config).to.be.an('array').and.to.have.lengthOf(2);
    _.each(info.config, function (conf) {
      expect(conf).to.include.all.keys('key', 'value');
    });
    expect(info.config[0]).to.be.nonStrictEqual({ key: 'static.baseDir', value: fixturesDir });
    expect(info.config[1].key).to.equal('not.secret');
    config.verify('not.secret', info.config[1].value);
  });

  it('excludes sensitive config', function () {
    expect(config.getObject()).to.include.key('secret');
    _.each(info.config, function (conf) {
      expect(conf.key).not.to.equal('secret');
    });
  });
});
