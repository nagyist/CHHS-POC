'use strict';

var chai = require('chai');
var sinon = require('sinon');

var expect = chai.expect;

var rewire = require('rewire');

var middleware = rewire('../../../../koe/middleware/staticContent');

var mockRouter = { use: sinon.spy() };
var mockExpress = { static: sinon.spy(function (param) { return param; }), Router: function () { return mockRouter; } };

var randomObject = require('../../../utils/randomObject');

describe('the staticContent middleware', function () {
  var config;
  before(function () {
    config = randomObject.newInstance();
    config.set('static.baseDir');
  });

  it('should return a function', function () {
    expect(middleware).to.be.a('function');
  });

  it('which returns an express Router', function () {
    expect(middleware(config.getObject()).name).to.match(/^router/);
  });

  it('which should be configured to serve the appropriate static directory', function () {
    middleware.__with__({ express: mockExpress, router: mockRouter })(function () {
      middleware(config.getObject());
      expect(mockExpress.static.calledOnce).to.be.true;
      config.verify('static.baseDir', mockExpress.static.args[0][0]);

      expect(mockRouter.use.calledOnce).to.be.true;
      config.verify('static.baseDir', mockRouter.use.args[0][0]);
    });
  });
});