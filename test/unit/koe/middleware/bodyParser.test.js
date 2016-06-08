'use strict';

var chai = require('chai');
var sinon = require('sinon');

var expect = chai.expect;

var rewire = require('rewire');
var nonStrictEquality = require('../../../utils/nonStrictEquality');
chai.use(nonStrictEquality);

var middleware = rewire('../../../../koe/middleware/bodyParser');

var mockBodyParser = { urlencoded: sinon.spy() };

describe('the bodyParser middleware', function () {
  it('should return a function', function () {
    expect(middleware).to.be.a('function');
  });

  it('which returns a middleware function', function () {
    expect(middleware()).to.be.a('function');
  });

  it('should use extended url encoding', function () {
    middleware.__with__('bodyParser', mockBodyParser)(function () {
      middleware();
      expect(mockBodyParser.urlencoded.calledOnce).to.be.true;
      expect(mockBodyParser.urlencoded.args[0][0]).to.be.nonStrictEqual({ extended: true });
    });
  });
});