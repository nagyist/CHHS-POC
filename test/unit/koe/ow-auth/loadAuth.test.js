'use strict';

var chai = require('chai');
var sinon = require('sinon');
var path = require('path');
var fs = require('fs');
var glob = require('glob');

var loadAuth = require('../../../../koe/ow-auth/loadAuth');

var nonStrictEquality = require('../../../utils/nonStrictEquality');
chai.use(nonStrictEquality);

var expect = chai.expect;
describe('the ow auth module loader', function () {
  var testAuthFixtures = path.resolve(__dirname, '../../../fixtures/auth/ow-auth-test/*.js');
  var testAuthDir = path.resolve(__dirname, '../../../../koe/ow-auth/ow-auth-test');

  var testPassport;
  var testEnsureAuthenticated;
  var testRoutes;
  var mockPassport;

  beforeEach(function () {
    if (!fs.existsSync(testAuthDir)){
      fs.mkdirSync(testAuthDir);
    }

    glob.sync(testAuthFixtures).forEach(function (filename) {
      var testAuthFile = path.join(testAuthDir, path.basename(filename));

      if (!fs.existsSync(testAuthFile)) {
        fs.linkSync(filename, testAuthFile);
      }
    });

    testPassport = require('../../../../koe/ow-auth/ow-auth-test/passport'); // eslint-disable-line global-require
    testEnsureAuthenticated = require('../../../../koe/ow-auth/ow-auth-test/ensureAuthenticated'); // eslint-disable-line global-require
    testRoutes = require('../../../../koe/ow-auth/ow-auth-test/routes'); // eslint-disable-line global-require

    mockPassport = {
      initialize: sinon.spy(function () { return { yes: 'no' }; }),
      session: sinon.spy(function () { return { no: 'maybe' }; })
    };

    testPassport.setInnerReturn(mockPassport);
  });

  afterEach(function () {
    glob.sync(testAuthFixtures).forEach(function (filename) {
      var testAuthFile = path.join(testAuthDir, path.basename(filename));
      fs.unlinkSync(testAuthFile);
    });

    fs.rmdirSync(testAuthDir);
  });

  it('should load the configured auth from the appropriate relative path', function () {
    loadAuth({ authMethod: 'test' });

    [testPassport, testEnsureAuthenticated, testRoutes].forEach(function (authModule) {
      expect(authModule.calledOnce).to.be.true;
    });
  });

  it('should initialize all modules with the passed config and paths', function () {
    var fakeConfig = { authMethod: 'test' };
    var fakePaths = { paths: ['fake'] };

    loadAuth(fakeConfig, fakePaths);

    [testPassport, testEnsureAuthenticated, testRoutes].forEach(function (authModule) {
      expect(authModule.calledWithExactly(fakeConfig, fakePaths)).to.be.true;
    });
  });

  it('initialization should initialize passport and the passport session', function () {
    loadAuth({ authMethod: 'test' }).initialize();

    expect(mockPassport.initialize.calledOnce).to.be.true;
    expect(mockPassport.session.calledOnce).to.be.true;
    expect(mockPassport.initialize.calledWithExactly()).to.be.true;
    expect(mockPassport.session.calledWithExactly()).to.be.true;
  });

  it('should return the initalized passport, session, ensureAuthenticated method and routes', function () {
    var ret = loadAuth({ authMethod: 'test' }).initialize();

    expect(ret[0]).to.be.nonStrictEqual({ yes: 'no' });
    expect(ret[1]).to.be.nonStrictEqual({ no: 'maybe' });
    expect(ret[2]).to.be.nonStrictEqual({ something: 'whatever' });
    expect(ret[3]).to.be.nonStrictEqual({ who: 'cares' });
  });
});
