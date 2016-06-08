'use strict';

var chai = require('chai');
var proxyquire = require('proxyquire');
var sinon = require('sinon');
var _ = require('lodash');
var Promise = require('bluebird');

var nonStrictEquality = require('../../../utils/nonStrictEquality');
chai.use(nonStrictEquality);

global.koe = {};
global.logger = { info: function () {} };

var expect = chai.expect;

describe('routes/index.js', function () {
  var mockRouter;

  function setupRouter() {
    mockRouter = {
      use: sinon.spy(),
      get: sinon.spy()
    };

    var mockExpress = {
      Router: function () {
        return mockRouter;
      }
    };

    proxyquire('../../../../server/routes/index', { express: mockExpress });
  }

  beforeEach(setupRouter);

  function getCallIndex(route) {
    return _(mockRouter.use.callCount).times().filter(function (call) {
      return mockRouter.use.getCall(call).calledWith(route);
    })[0];
  }

  function getCall(route) {
    return mockRouter.use.getCall(getCallIndex(route));
  }

  describe('basic routing', function () {
    it('should set a GET route on /', function () {
      expect(mockRouter.get.calledWith('/')).to.be.true;
    });

    ['/status', '/api/status', '/api/components', '/api/bindings', '/debug', '/minify'].forEach(function (route) {
      it('should set a USE route on ' + route, function () {
        expect(mockRouter.use.calledWith(route)).to.be.true;
      });
    });
  });

  describe('GET /', function () {
    it('should render the index page', function () {
      var call = mockRouter.get.getCall(0);
      var callback = call.args[1];

      var mockResponse = { render: sinon.spy() };
      callback({}, mockResponse);

      expect(mockResponse.render.args[0][0]).to.equal('index');
    });

    it('should pass the appropriate arguments to the index page', function () {
      var call = mockRouter.get.getCall(0);
      var callback = call.args[1];

      var mockResponse = { render: sinon.spy() };
      callback({ user: { name: 'connie' }}, mockResponse);

      // Update this line if this test starts failing because you are adding data to the page model
      expect(mockResponse.render.args[0][1]).to.be.nonStrictEqual({ defines: [{ name: 'currentuser', content: { name: 'connie' } }]});
    });
  });

  describe('USE /status', function () {
    it('should send a 200 response if the up/down status is UP', function (done) {
      var call = getCall('/status');
      var callback = call.args[1];

      global.koe = {
        app: {
          status: {
            getUpDownStatus: function () {
              return Promise.resolve(true);
            }
          }
        }
      };

      var mockResponse = {
        status: sinon.spy(function () {
          return mockResponse;
        }),
        send: function () {
          expect(mockResponse.status.calledWithExactly(200)).to.be.true;
          done();
        }
      };
      callback(undefined, mockResponse);
    });

    it('should send a 500 response if the up/down status is DOWN', function (done) {
      var call = getCall('/status');
      var callback = call.args[1];

      global.koe = {
        app: {
          status: {
            getUpDownStatus: function () {
              return Promise.resolve(false);
            }
          }
        }
      };

      var mockResponse = {
        status: sinon.spy(function () {
          return mockResponse;
        }),
        send: function () {
          expect(mockResponse.status.calledWithExactly(500)).to.be.true;
          done();
        }
      };
      callback(undefined, mockResponse);
    });
  });

  describe('USE /api/status', function () {
    it('should send the merged detailed status information with the application info', function (done) {
      var call = getCall('/api/status');
      var callback = call.args[1];
      var statusChecks = [{ watching: 'England vs. Sri Lanka, second test', writing: 'unit tests' }];

      global.koe = {
        app: {
          status: {
            getFullStatusInfo: function () {
              return Promise.resolve(statusChecks);
            }
          },
          appInfo: {
            score: '46-1',
            overs: 19
          }
        }
      };

      var mockResponse = {
        send: function (data) {
          expect(data).to.be.nonStrictEqual({ score: '46-1', overs: 19, statusChecks: statusChecks });
          done();
        }
      };
      callback(undefined, mockResponse);
    });
  });

  describe('USE /api/components', function () {
    var components = [{ batsmen: ['compton', 'hales'] }];
    var koe;

    function setupComponents() {
      global.koe = koe = {
        app: {
          componentsAndBindings: {
            findComponents: sinon.spy(function () {
              return components;
            })
          }
        },
        config: {
          dev: 'time for a coffee'
        }
      };

      setupRouter();
    }

    it('should send the list of found components', function () {
      setupComponents();

      var call = getCall('/api/components');
      var callback = call.args[1];

      var mockResponse = { send: sinon.spy() };
      callback(undefined, mockResponse);

      expect(mockResponse.send.args[0][0]).to.equal(components);
    });

    it('should pass the value of config.dev to the findComponents method', function () {
      setupComponents();

      var call = getCall('/api/components');
      var callback = call.args[1];

      var mockResponse = { send: sinon.spy() };
      callback(undefined, mockResponse);

      expect(koe.app.componentsAndBindings.findComponents.calledWithExactly('time for a coffee')).to.be.true;
    });
  });

  describe('USE /api/bindings', function () {
    var bindings = ['5', '34*'];
    var koe;

    function setupBindings() {
      global.koe = koe = {
        app: {
          componentsAndBindings: {
            findBindings: sinon.spy(function () {
              return bindings;
            })
          }
        },
        config: {
          dev: 'definitely not tea'
        }
      };

      setupRouter();
    }

    it('should send the list of found bindings', function () {
      setupBindings();

      var call = getCall('/api/bindings');
      var callback = call.args[1];

      var mockResponse = { send: sinon.spy() };
      callback(undefined, mockResponse);

      expect(mockResponse.send.args[0][0]).to.equal(bindings);
    });

    it('should pass the value of config.dev to the findBindings method', function () {
      setupBindings();

      var call = getCall('/api/bindings');
      var callback = call.args[1];

      var mockResponse = { send: sinon.spy() };
      callback(undefined, mockResponse);

      expect(koe.app.componentsAndBindings.findBindings.calledWithExactly('definitely not tea')).to.be.true;
    });
  });

  ['/debug', '/minify'].forEach(function (assets) {
    describe('USE ' + assets, function () {
      before(function () {
        global.koe = { config: { secure: 'wibble' } };
        setupRouter();
      });

      var value = assets.replace(/\//,'');

      it('should set the assets cookie to "' + value + '"', function () {
        var call = getCall(assets);
        var callback = call.args[1];

        var mockResponse = { cookie: sinon.spy(), redirect: sinon.spy() };
        callback(undefined, mockResponse);

        expect(mockResponse.cookie.args[0][0]).to.equal('assets');
        expect(mockResponse.cookie.args[0][1]).to.equal(value);
      });

      it('should set the appropriate security flags on the cookie', function () {
        var call = getCall(assets);
        var callback = call.args[1];

        var mockResponse = { cookie: sinon.spy(), redirect: sinon.spy() };
        callback(undefined, mockResponse);

        expect(mockResponse.cookie.args[0][2]).to.be.nonStrictEqual({ signed: true, httpOnly: true, secure: 'wibble' });
      });

      it('should redirect to /', function () {
        var call = getCall(assets);
        var callback = call.args[1];

        var mockResponse = { cookie: sinon.spy(), redirect: sinon.spy() };
        callback(undefined, mockResponse);

        expect(mockResponse.redirect.calledWithExactly('/')).to.be.true;
      });
    });
  });
});

