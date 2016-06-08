'use strict';

var chai = require('chai');
var sinon = require('sinon');
var rewire = require('rewire');

var routes = rewire('../../../../../koe/ow-auth/ow-auth-none/routes');

var expect = chai.expect;

describe('ow-auth-none routes', function () {
  var mockRouter;

  beforeEach(function () {
    mockRouter = {
      get: sinon.spy()
    };
  });

  it('should be a function', function () {
    expect(routes).to.be.a('function');
  });

  it('which returns a router', function () {
    routes.__set__('router', mockRouter);
    expect(routes()).to.equal(mockRouter);
  });

  it('the router should be initialized with login and logout methods', function () {
    routes.__set__('router', mockRouter);
    routes();

    expect(mockRouter.get.calledTwice).to.be.true;
    expect(mockRouter.get.calledWith('/login')).to.be.true;
    expect(mockRouter.get.calledWith('/logout')).to.be.true;
  });

  it('the login method should redirect to /', function () {
    var mockResponse = { redirect: sinon.spy() };

    routes.__set__('router', mockRouter);
    routes();

    var login = mockRouter.get.args[0][1];

    login(undefined, mockResponse);

    expect(mockResponse.redirect.calledOnce).to.be.true;
    expect(mockResponse.redirect.calledWithExactly('/')).to.be.true;
  });

  it('the logout method should redirect to /', function () {
    var mockResponse = { redirect: sinon.spy() };

    routes.__set__('router', mockRouter);
    routes();

    var logout = mockRouter.get.args[1][1];

    logout(undefined, mockResponse);

    expect(mockResponse.redirect.calledOnce).to.be.true;
    expect(mockResponse.redirect.calledWithExactly('/')).to.be.true;
  });
});