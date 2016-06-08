'use strict';

var chai = require('chai');
var sinon = require('sinon');

var expect = chai.expect;

var middleware = require('../../../../koe/middleware/spoofSecureConnection');

var randomObject = require('../../../utils/randomObject');
var noop = function () {};

describe('the spoofSecureConnection middleware', function () {
  it('should return a function', function () {
    expect(middleware).to.be.a('function');
  });

  it('which returns a middleware function', function () {
    expect(middleware({})).to.be.a('function');
  });

  it('should create a connection property on the request if none exists', function () {
    var req = {};
    middleware({})(req, undefined, noop);

    expect(req.connection).to.be.an('object');
  });

  it('should create an encrypted property if none exists', function () {
    var req = {};
    middleware({})(req, undefined, noop);

    expect(req.connection).to.have.property('encrypted');
  });

  it('should set the encrypted flag on the request object to the value of config.secure', function () {
    var config = randomObject.newInstance();
    config.set('secure');

    var req = {};
    middleware(config.getObject())(req, undefined, noop);

    config.verify('secure', req.connection.encrypted);
  });

  it('should not change anything if those properties already exist', function () {
    var config = randomObject.newInstance();
    config.set('secure');

    var req = {
      connection: {
        encrypted: 'testing'
      }
    };

    middleware(config.getObject())(req, undefined, noop);
    expect(req.connection.encrypted).not.to.equal(config.get('secure'));
  });

  it('should call next at the end', function () {
    var next = sinon.spy();
    var req = {};
    middleware({})(req, undefined, next);

    expect(next.calledOnce).to.be.true;
  });
});
