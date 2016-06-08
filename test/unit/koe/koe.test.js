'use strict';

var chai = require('chai');
var requireRoot = require('../../../koe/utils/requireRoot');
var sinon = require('sinon');
var rewire = require('rewire');

var expect = chai.expect;

var knockoutExpress = rewire('../../../koe/koe');

var config = { config: 'config' };
var configMock = sinon.spy(function () { return config; });

var logger = { logger: 'logger' };
var loggerMock = sinon.spy(function () { return logger; });

var auth = { auth: 'auth' };
var authMock = sinon.spy(function () { return auth; });

var app = { app: 'app' };
var appMock = sinon.spy(function () { return app; });

var middleware = { middleware: 'middleware' };
var middlewareMock = sinon.spy(function () { return middleware; });

var errorHandling = { errorHandling: 'errorHandling' };
var errorHandlingMock = sinon.spy(function () { return errorHandling; });

var utils = { utils: 'utils' };

knockoutExpress.__set__('configModule', configMock);
knockoutExpress.__set__('loggingModule', loggerMock);
knockoutExpress.__set__('authModule', authMock);

knockoutExpress.__set__('app', appMock);
knockoutExpress.__set__('middleware', middlewareMock);
knockoutExpress.__set__('errorHandling', errorHandlingMock);
knockoutExpress.__set__('utils', utils);

describe('the koe god module', function () {

  before(function () {
    requireRoot.setTestMode('../../test/fixtures/koe');
  });

  after(function () {
    requireRoot.setTestMode(false);
  });

  it('should return a function', function () {
    expect(knockoutExpress).to.be.a('function');
  });

  describe('initialization', function () {
    var koe;

    before(function () {
      koe = knockoutExpress();
    });

    it('should returns an object', function () {
      expect(koe).to.be.an('object');
    });

    it('should initialize config with no arguments', function () {
      expect(configMock.calledOnce).to.be.true;
      expect(configMock.calledWithExactly()).to.be.true;
    });

    it('should initialize the logger with the config', function () {
      expect(loggerMock.calledOnce).to.be.true;
      expect(loggerMock.calledWithExactly(config)).to.be.true;
    });

    it('should initialize auth with the config and logger', function () {
      expect(authMock.calledOnce).to.be.true;
      expect(authMock.calledWithExactly(config, logger)).to.be.true;
    });

    it('should initialize the app module with the config', function () {
      expect(appMock.calledOnce).to.be.true;
      expect(appMock.calledWithExactly(config)).to.be.true;
    });

    it('should initialize the middleware module with the config', function () {
      expect(middlewareMock.calledOnce).to.be.true;
      expect(middlewareMock.calledWithExactly(config)).to.be.true;
    });

    it('should initialize the error handling module with the config and logger', function () {
      expect(errorHandlingMock.calledOnce).to.be.true;
      expect(errorHandlingMock.calledWithExactly(config, logger)).to.be.true;
    });

    it('should expose all imported modules', function () {
      expect(koe).to.have.all.keys('app', 'middleware', 'errorHandling', 'utils', 'config', 'logger', 'auth');
      expect(koe.app).to.equal(app);
      expect(koe.middleware).to.equal(middleware);
      expect(koe.errorHandling).to.equal(errorHandling);
      expect(koe.utils).to.equal(utils);
      expect(koe.config).to.equal(config);
      expect(koe.logger).to.equal(logger);
      expect(koe.auth).to.equal(auth);
    });
  });
});