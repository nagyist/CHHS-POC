'use strict';

var chai = require('chai');
var sinon = require('sinon');
var ensureAuthenticated = require('../../../../../koe/ow-auth/ow-auth-none/ensureAuthenticated');

var expect = chai.expect;

describe('ow-auth-none ensureAuthenticated', function () {
  it('should be a function', function () {
    expect(ensureAuthenticated).to.be.a('function');
  });

  it('which returns a function', function () {
    expect(ensureAuthenticated()).to.be.a('function');
  });

  it('which just calls next', function () {
    var next = sinon.spy();

    ensureAuthenticated()(undefined, undefined, next);

    expect(next.calledOnce).to.be.true;
    expect(next.calledWithExactly()).to.be.true;
  });
});