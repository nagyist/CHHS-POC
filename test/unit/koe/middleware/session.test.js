'use strict';

var chai = require('chai');
var sinon = require('sinon');

var expect = chai.expect;

var rewire = require('rewire');
var nonStrictEquality = require('../../../utils/nonStrictEquality');
chai.use(nonStrictEquality);

var middleware = rewire('../../../../koe/middleware/session');

var randomObject = require('../../../utils/randomObject');

describe('the session middleware', function () {
  it('should return a function', function () {
    expect(middleware).to.be.a('function');
  });

  it('which returns a middleware function', function () {
    var config = randomObject.newInstance();
    config.set('sessionSecret');
    expect(middleware(config.getObject())).to.be.a('function');
  });

  it('should use the configured session secret', function () {
    var config = randomObject.newInstance();
    config.set('sessionSecret');
    var mockSession = sinon.spy();

    middleware.__with__('session', mockSession)(function () {
      middleware(config.getObject());
      expect(mockSession.calledOnce).to.be.true;
      config.verify('sessionSecret', mockSession.args[0][0].secret);
    });
  });

  it('should set the secure flag based on config', function () {
    var config = randomObject.newInstance();
    config.set('secure');
    var mockSession = sinon.spy();

    middleware.__with__('session', mockSession)(function () {
      middleware(config.getObject());
      expect(mockSession.calledOnce).to.be.true;
      config.verify('secure', mockSession.args[0][0].cookie.secure);
    });
  });

  it('should use v4 uuids for id generation', function () {
    var config = randomObject.newInstance();
    config.set('sessionSecret');

    var mockSession = sinon.spy();
    var mockUUID = { v4: sinon.spy() };

    middleware.__with__({ session: mockSession, uuid: mockUUID })(function () {
      middleware(config.getObject());
      var args = mockSession.args[0][0];
      expect(mockUUID.v4.called).to.be.false;
      args.genid();
      expect(mockUUID.v4.calledOnce).to.be.true;
    });
  });
});