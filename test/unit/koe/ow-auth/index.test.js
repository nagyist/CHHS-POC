'use strict';

var chai = require('chai');
var sinon = require('sinon');
var rewire = require('rewire');

var owAuth = rewire('../../../../koe/ow-auth');
var requireRoot = require('../../../../koe/utils/requireRoot');

var nonStrictEquality = require('../../../utils/nonStrictEquality');
chai.use(nonStrictEquality);

var expect = chai.expect;
describe('the ow auth parent module', function () {
  var mockAssert;
  var mockLogger;
  var mockAuth;
  var mockLoader;
  var initializedAuth = {};

  before(function () {
    requireRoot.setTestMode('../../test/fixtures/auth');
  });

  after(function () {
    requireRoot.setTestMode(false);
  });

  beforeEach(function () {
    mockAssert = sinon.spy();
    mockLogger = { warn: sinon.spy(), info: sinon.spy() };
    mockAuth = {
      initialize: sinon.spy(function () {
        return initializedAuth;
      })
    };
    mockLoader = sinon.spy(function () { return mockAuth; });
  });

  it('should return a function', function () {
    expect(owAuth).to.be.a('function');
  });

  it('should throw an error if no auth is configured and we are not in dev', function () {
    expect(owAuth.bind(owAuth, {}, mockLogger)).to.throw('OW Auth has not been configured, you must add this to the application config first. See ow-auth-config.md for more info.');
  });

  it('should return an initialize function', function () {
    var auth = owAuth({ owAuth: { authMethod: 'none' }}, mockLogger);
    expect(auth).to.have.all.keys('initialize');
    expect(auth.initialize).to.be.a('function');
  });

  describe('defaults', function () {
    it('should default to ow-auth-none if no auth is configured in dev', function () {
      var reset = owAuth.__set__({
        assert: mockAssert,
        loadAuthModules: mockLoader
      });
      
      owAuth({ dev: true }, mockLogger).initialize();

      expect(mockAssert.calledWithExactly(true, 'Missing owAuthConfig.authMethod')).to.be.true;
      expect(mockAssert.calledWithExactly(true, 'Unknown authMethod: "none"')).to.be.true;

      expect(mockLoader.calledOnce).to.be.true;
      expect(mockLoader.args[0][0]).to.be.nonStrictEqual({ authMethod: 'none' });
      expect(mockLoader.args[0][1]).to.be.nonStrictEqual({ whoop: ["this", "is", "a", "test", "file"] });

      expect(mockLogger.info.calledOnce).to.be.true;
      expect(mockLogger.info.calledWithExactly('Using owAuthConfig.authMethod:', 'none')).to.be.true;

      reset();
    });
  });
  
  describe('validation', function () {
    it('should ensure that we have specified an auth method', function () {
      var reset = owAuth.__set__({
        assert: mockAssert,
        loadAuthModules: mockLoader
      });
      
      owAuth({ owAuth: {} }, mockLogger).initialize();
      owAuth({ owAuth: { authMethod: 'hello' }}, mockLogger).initialize();

      expect(mockAssert.callCount).to.equal(4);
      expect(mockAssert.getCall(0).calledWithExactly(false, 'Missing owAuthConfig.authMethod')).to.be.true;
      expect(mockAssert.getCall(2).calledWithExactly(true, 'Missing owAuthConfig.authMethod')).to.be.true;

      reset();
    });
  });

  describe('returns', function () {
    it('should return the result of calling initialize on the configured auth module', function () {
      owAuth.__with__('loadAuthModules', mockLoader)(function () {
        var ret = owAuth({ dev: true }, mockLogger).initialize();
        expect(ret).to.equal(initializedAuth);
      });
    });
  });

});
