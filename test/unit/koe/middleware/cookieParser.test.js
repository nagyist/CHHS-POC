'use strict';

var chai = require('chai');
var sinon = require('sinon');

var expect = chai.expect;

var rewire = require('rewire');
var nonStrictEquality = require('../../../utils/nonStrictEquality');
chai.use(nonStrictEquality);

var middleware = rewire('../../../../koe/middleware/cookieParser');

var mockCookieParser = sinon.spy();

var randomObject = require('../../../utils/randomObject');

describe('the cookieParser middleware', function () {
  it('should return a function', function () {
    expect(middleware).to.be.a('function');
  });

  it('which returns a middleware function', function () {
    expect(middleware({})).to.be.a('function');
  });

  it('should use the configured cookie secret', function () {
    var config = randomObject.newInstance();
    config.set('cookieSecret');

    middleware.__with__('cookieParser', mockCookieParser)(function () {
      middleware(config.getObject());
      expect(mockCookieParser.calledOnce).to.be.true;
      config.verify('cookieSecret', mockCookieParser.args[0][0]);
    });
  });
});