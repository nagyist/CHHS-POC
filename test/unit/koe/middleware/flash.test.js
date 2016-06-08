'use strict';

var chai = require('chai');
var sinon = require('sinon');

var expect = chai.expect;

var rewire = require('rewire');
var nonStrictEquality = require('../../../utils/nonStrictEquality');
chai.use(nonStrictEquality);

var middleware = rewire('../../../../koe/middleware/flash');

var mockFlash = sinon.spy();

describe('the flash middleware', function () {
  it('should return a function', function () {
    expect(middleware).to.be.a('function');
  });

  it('which returns a middleware function', function () {
    expect(middleware()).to.be.a('function');
  });

  it('should call the flash library with no arguments', function () {
    middleware.__with__('flash', mockFlash)(function () {
      middleware();
      expect(mockFlash.calledOnce).to.be.true;
      expect(mockFlash.alwaysCalledWithExactly()).to.be.true;
    });
  });
});