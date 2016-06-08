'use strict';

var chai = require('chai');
var sinon = require('sinon');

var expect = chai.expect;

var rewire = require('rewire');
var nonStrictEquality = require('../../../utils/nonStrictEquality');
chai.use(nonStrictEquality);

var middleware = rewire('../../../../koe/middleware/helmet');

var mockHelmet = { frameguard: sinon.spy() };

describe('the helmet middleware', function () {
  it('should return a function', function () {
    expect(middleware).to.be.a('function');
  });

  it('which returns a middleware function', function () {
    expect(middleware()).to.be.a('function');
  });

  it('should set frameguard to deny', function () {
    middleware.__with__('helmet', mockHelmet)(function () {
      middleware();
      expect(mockHelmet.frameguard.calledOnce).to.be.true;
      expect(mockHelmet.frameguard.alwaysCalledWith('deny')).to.be.true;
    });
  });
});