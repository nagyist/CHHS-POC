'use strict';

var chai = require('chai');
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var _ = require('lodash');

var randomObject = require('../../utils/randomObject');
var nonStrictEquality = require('../../utils/nonStrictEquality');
chai.use(nonStrictEquality);

var expect = chai.expect;

describe('the application startup script', function () {
  var mockApp;
  var mockKoe;
  var mockLogger;
  var mockExpress = function () { return mockApp; };
  var app;

  var mockSession;

  beforeEach(function () {
    mockKoe = randomObject.newInstance();
    mockKoe.set('config.handlebars.viewsDir');
    mockKoe.set('config.routesDir');
    mockKoe.set('config.port');

    mockKoe.set('app.handlebarsRenderingEngine');

    mockKoe.set('middleware.spoofSecureConnection');
    mockKoe.set('middleware.helmet');
    mockKoe.set('middleware.staticContent');
    mockKoe.set('middleware.cookieParser');
    mockKoe.set('middleware.bodyParser');
    mockKoe.set('middleware.session');
    mockKoe.set('middleware.templateData');
    mockKoe.set('middleware.flash');

    mockKoe.set('auth.initialize', function () { return mockKoe.get('dummy.auth'); });

    mockKoe.set('errorHandling.defaultErrorHandler');

    mockKoe.set('utils.autoconfigureRoutes', sinon.spy(function () {
      return mockKoe.get('dummy.autoconfiguredRoutes');
    }));

    mockKoe.set('dummy.autoconfiguredRoutes');
    mockKoe.set('dummy.address');
    mockKoe.set('dummy.auth');

    mockLogger = { info: sinon.spy() };
    mockKoe.set('logger', mockLogger);

    mockSession = sinon.spy(function () {
      return mockKoe.set('dummy.session');
    });

    mockKoe.set('utils.requireRoot', function () {});

    mockApp = {
      set: sinon.spy(),
      engine: sinon.spy(),
      use: sinon.spy(),
      listen: sinon.spy(function () {
        return {
          address: function () {
            return { port: mockKoe.get('config.port'), address: mockKoe.get('dummy.address') };
          }
        };
      })
    };

    app = proxyquire('../../../server/app', {
      '../koe': mockKoe.getObject(),
      './session': mockSession,
      express: mockExpress
    });
  });

  it('should return the application', function () {
    expect(app).to.equal(mockApp);
  });

  describe('basic application startup', function () {

    it('should set the views directory', function () {
      expect(mockApp.set.calledWithExactly('views', mockKoe.get('config.handlebars.viewsDir'))).to.be.true;
    });

    it('should set handlebars as the rendering engine', function () {
      expect(mockApp.engine.calledWithExactly('.hbs', mockKoe.get('app.handlebarsRenderingEngine'))).to.be.true;
      expect(mockApp.set.calledWithExactly('view engine', '.hbs')).to.be.true;
    });

    ['spoofSecureConnection', 'helmet', 'staticContent', 'cookieParser', 'bodyParser', 'flash', 'templateData'].forEach(function (middleware) {
      it('should use the ' + middleware + ' middleware', function () {
        expect(mockApp.use.calledWithExactly(mockKoe.get('middleware.' + middleware))).to.be.true;
      });
    });

    it('should use koe authentication', function () {
      expect(mockApp.use.calledWithExactly(mockKoe.get('dummy.auth'))).to.be.true;
    });

    it('should autoconfigure the routes in the configured routes directory', function () {
      expect(mockApp.use.calledWithExactly(mockKoe.get('dummy.autoconfiguredRoutes'))).to.be.true;
      var autoconfigure = mockKoe.get('utils.autoconfigureRoutes');
      expect(autoconfigure.calledWithExactly(mockKoe.get('config.routesDir'), mockLogger)).to.be.true;
    });

    it('should set up the default error handler', function () {
      expect(mockApp.use.calledWithExactly(mockKoe.get('errorHandling.defaultErrorHandler'))).to.be.true;
    });

    it('should set the application listening on the configured port', function () {
      expect(mockApp.listen.calledOnce).to.be.true;
      mockKoe.verify('config.port', mockApp.listen.args[0][0]);
    });

    it('should log on successful application start', function () {
      var listenCallback = mockApp.listen.args[0][1];
      expect(listenCallback).to.be.a('function');

      listenCallback();

      expect(mockLogger.info.calledOnce).to.be.true;
      expect(mockLogger.info.calledWithExactly('Express server listening at http://%s:%s', mockKoe.get('dummy.address'), mockKoe.get('config.port'))).to.be.true;
    });
  });

  describe('if ssl credentials have been configured', function () {
    var mockHttps;

    beforeEach(function () {
      mockKoe.set('app.sslCredentials');
      mockKoe.set('config.portHttps');

      mockHttps = {
        createServer: sinon.spy(function () {
          return mockHttps;
        }),
        listen: sinon.spy(function () {
          return mockHttps;
        }),
        address: sinon.spy(function () {
          return { address: mockKoe.get('dummy.address') };
        })
      };

      app = proxyquire('../../../server/app', {
        '../koe': mockKoe.getObject(),
        express: mockExpress,
        https: mockHttps,
        './session': mockSession
      });
    });

    it('should create an https server', function () {

      expect(mockHttps.createServer.calledOnce).to.be.true;
      expect(mockHttps.createServer.calledWithExactly(mockKoe.get('app.sslCredentials'), mockApp)).to.be.true;

    });

    it('should start the https server listening on the configured https port', function () {
      expect(mockHttps.listen.calledOnce).to.be.true;
      mockKoe.verify('config.portHttps', mockHttps.listen.args[0][0]);
    });

    it('should log on successful https application start', function () {
      var listenCallback = mockHttps.listen.args[0][1];
      expect(listenCallback).to.be.a('function');

      listenCallback();

      expect(mockLogger.info.calledOnce).to.be.true;
      expect(mockLogger.info.calledWithExactly('Express server listening on host "%s", port %s (HTTPS)', mockKoe.get('dummy.address'), mockKoe.get('config.portHttps'))).to.be.true;
    });
  });

  describe('middleware ordering', function () {

    function getCallIndex(callString) {
      return _(mockApp.use.callCount).times().filter(function (call) {
        return mockApp.use.getCall(call).calledWithExactly(mockKoe.get(callString));
      })[0];
    }

    ['spoofSecureConnection', 'helmet', 'staticContent', 'cookieParser', 'bodyParser', 'flash', 'templateData'].forEach(function (middleware) {
      it('should use the ' + middleware + ' middleware before auth', function () {
        var authCall = getCallIndex('dummy.auth');
        var middlewareCall = getCallIndex('middleware.' + middleware);

        expect(middlewareCall).to.be.lessThan(authCall);
      });
    });

    it('should use the session middleware before auth', function () {
      var authCall = getCallIndex('dummy.auth');
      var sessionCall = getCallIndex('dummy.session');

      expect(sessionCall).to.be.lessThan(authCall);
    });

    [
      [{ desc: 'cookieParser', lookup: 'middleware.cookieParser' }, { desc: 'session', lookup: 'dummy.session' }],
      [{ desc: 'cookieParser', lookup: 'middleware.cookieParser' }, {
        desc: 'templateData',
        lookup: 'middleware.templateData'
      }],
      [{ desc: 'auth', lookup: 'dummy.auth' }, { desc: 'routes', lookup: 'dummy.autoconfiguredRoutes' }],
      [{ desc: 'routes', lookup: 'dummy.autoconfiguredRoutes' }, {
        desc: 'error handling',
        lookup: 'errorHandling.defaultErrorHandler'
      }]
    ].forEach(function (mids) {
      var first = mids[0];
      var second = mids[1];

      it('should use the ' + first.desc + ' before the ' + second.desc, function () {
        var firstCall = getCallIndex(first.lookup);
        var secondCall = getCallIndex(second.lookup);

        expect(firstCall).to.be.lessThan(secondCall);
      });
    });

    it('should use the spoofSecureConnection, helmet and staticContent middlewares first', function () {
      var calls = ['spoofSecureConnection', 'helmet', 'staticContent'].map(function (middleware) {
        return getCallIndex('middleware.' + middleware);
      }).sort();

      expect(calls).to.be.nonStrictEqual([0, 1, 2]);
    });

    it('should use the default error handling last', function () {
      var errorCall = getCallIndex('errorHandling.defaultErrorHandler');
      expect(errorCall).to.equal(mockApp.use.callCount - 1); // zero-indexing
    });
  });
});