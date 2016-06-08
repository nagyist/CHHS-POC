'use strict';

var chai = require('chai');
var sinon = require('sinon');

var expect = chai.expect;

var errorHandler = require('../../../../koe/errorHandling/defaultErrorHandler');
var randomObject = require('../../../utils/randomObject');
var config, res, next, logger;

describe('the default error handler', function () {

  beforeEach(function () {
    config = randomObject.newInstance();
    res = { status: sinon.spy(), send: sinon.spy() };
    next = sinon.spy();
    logger = { error: sinon.spy() };
  });

  it('should return a function', function () {
    var handler = errorHandler(config.getObject(), logger);
    expect(handler).to.be.a('function');
  });

  it('should log the error details as errors', function () {
    var handler = errorHandler(config.getObject(), logger);
    var err = { name: 'foo', message: 'bar', stack: 'baz', status: 'biff'};

    handler(err, undefined, res, next);

    expect(logger.error.calledTwice).to.be.true;
    expect(logger.error.getCall(0).calledWithExactly('SERVER ERROR:')).to.be.true;
    expect(logger.error.getCall(1).calledWithExactly('{\n    "name": "foo",\n    "message": "bar",\n    "stack": "baz"\n}')).to.be.true;
  });

  it('should set the appropriate status on the response', function () {
    var handler = errorHandler(config.getObject(), logger);
    var err = { name: 'foo', message: 'bar', stack: 'baz', status: 'biff'};

    handler(err, undefined, res, next);

    expect(res.status.calledOnce).to.be.true;
    expect(res.status.calledWith('biff')).to.be.true;
  });

  it('should default to status 500', function () {
    var handler = errorHandler(config.getObject(), logger);
    var err = { name: 'foo', message: 'bar', stack: 'baz'};

    handler(err, undefined, res, next);

    expect(res.status.calledOnce).to.be.true;
    expect(res.status.calledWith(500)).to.be.true;
  });

  it('should call through to the next function', function () {
    var handler = errorHandler(config.getObject(), logger);
    var err = { name: 'foo', message: 'bar', stack: 'baz'};

    handler(err, undefined, res, next);

    expect(next.calledOnce).to.be.true;
  });

  describe('when running in dev mode', function () {
    it('should return the error details in the response', function () {
      config.set('errorDebug', true);
      var handler = errorHandler(config.getObject(), logger);
      var err = { name: 'foo', message: 'bar', stack: 'baz'};

      handler(err, undefined, res, next);

      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith('{\n    "name": "foo",\n    "message": "bar",\n    "stack": "baz"\n}')).to.be.true;
    });
  });

  describe('when not running in dev mode', function () {
    it('should swallow the error', function () {
      var handler = errorHandler(config.getObject(), logger);
      var err = { name: 'foo', message: 'bar', stack: 'baz'};

      handler(err, undefined, res, next);

      expect(res.send.calledOnce).to.be.true;
      expect(res.send.calledWith('A server error has occurred.')).to.be.true;
    });
  });
});