'use strict';

var chai = require('chai');
var sinon = require('sinon');
var passport = require('../../../../../koe/ow-auth/ow-auth-none/passport');

var expect = chai.expect;

describe('ow-auth-none passport', function () {
  it('should be a function', function () {
    expect(passport).to.be.a('function');
  });

  it('which returns an object', function () {
    expect(passport()).to.be.an('object');
  });
  
  it('the returned passport object should have all required methods', function () {
    var pp = passport();

    expect(pp.initialize).to.be.a('function');
    expect(pp.authenticate).to.be.a('function');
    expect(pp.session).to.be.a('function');
  });

  it('all required methods should return a passthrough', function () {
    var pp = passport();
    ['initialize', 'authenticate', 'session'].forEach(function (meth) {
      var next = sinon.spy();
      expect(pp[meth]).to.be.a('function');
      pp[meth]()(undefined, undefined, next);

      expect(next.calledOnce).to.be.true;
      expect(next.calledWithExactly()).to.be.true;
    });
  });
});