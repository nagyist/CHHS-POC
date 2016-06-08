'use strict';

var chai = require('chai');
var sinon = require('sinon');
var rewire = require('rewire');
var Promise = require('bluebird');

var routes = rewire('../../../../server/ow-auth-db/routes');
var nonStrictEquality = require('../../../utils/nonStrictEquality');
chai.use(nonStrictEquality);

var randomObject = require('../../../utils/randomObject');

var expect = chai.expect;

describe('ow-auth-db routes', function () {
  var mockRouter;
  var mockPassport;
  var mockAuthenticate;

  beforeEach(function () {
    mockRouter = {
      get: sinon.spy(),
      post: sinon.spy(),
      use: sinon.spy()
    };

    mockAuthenticate = { mocking: 'authentication' };

    mockPassport = {
      authenticate: sinon.spy(function () {
        return mockAuthenticate;
      })
    };
  });

  it('should be a function', function () {
    expect(routes).to.be.a('function');
  });

  it('which returns a router', function () {
    routes.__set__({
      router: mockRouter, passportModule: function () {
        return mockPassport;
      }
    });
    expect(routes()).to.equal(mockRouter);
  });

  it('the router should be initialized with login, register and logout methods', function () {
    routes.__set__({
      router: mockRouter, passportModule: function () {
        return mockPassport;
      }
    });
    routes();

    expect(mockRouter.get.calledWith('/login')).to.be.true;
    expect(mockRouter.get.calledWith('/register')).to.be.true;
    expect(mockRouter.use.calledWith('/logout')).to.be.true;
  });

  it('the router should be initialized with a currentuser method', function () {
    routes.__set__({
      router: mockRouter, passportModule: function () {
        return mockPassport;
      }
    });
    routes();

    expect(mockRouter.get.calledWith('/api/auth/currentUser')).to.be.true;
  });

  it('the router should be initialized with login and register post handers', function () {
    routes.__set__({
      router: mockRouter, passportModule: function () {
        return mockPassport;
      }
    });
    routes();

    expect(mockRouter.post.calledWith('/login')).to.be.true;
    expect(mockRouter.post.calledWith('/register')).to.be.true;
  });

  it('no other routes should be added', function () {
    routes.__set__({
      router: mockRouter, passportModule: function () {
        return mockPassport;
      }
    });
    routes();

    expect(mockRouter.get.calledThrice).to.be.true;
    expect(mockRouter.post.calledTwice).to.be.true;
    expect(mockRouter.use.calledOnce).to.be.true;
  });

  describe('the login GET method', function () {
    it('should send a login page', function () {
      var mockResponse = { render: sinon.spy() };

      routes.__set__('router', mockRouter);
      routes();

      var login = mockRouter.get.args[0][1];

      login({flash: function () {}}, mockResponse);

      expect(mockResponse.render.calledOnce).to.be.true;
      expect(mockResponse.render.args[0][0]).to.match(/login.hbs$/);
    });
  });

  describe('the register GET method', function () {
    it('should send a register page', function () {
      var mockResponse = { render: sinon.spy() };

      routes.__set__('router', mockRouter);
      routes();

      var register = mockRouter.get.args[1][1];

      register({flash: function () {}}, mockResponse);

      expect(mockResponse.render.calledOnce).to.be.true;
      expect(mockResponse.render.args[0][0]).to.match(/register.hbs$/);
    });
  });

  describe('the logout method', function () {
    it('should destroy the session and redirect to /login', function () {
      var mockRequest = { logout: sinon.spy(), session: { destroy: sinon.spy() }, flash: function () {} };
      var mockResponse = { redirect: sinon.spy() };

      routes.__set__('router', mockRouter);
      routes();

      var logout = mockRouter.use.args[0][1];

      logout(mockRequest, mockResponse);

      expect(mockRequest.logout.calledOnce).to.be.true;
      expect(mockRequest.logout.calledWithExactly()).to.be.true;

      expect(mockRequest.session.destroy.calledOnce).to.be.true;
      expect(mockRequest.session.destroy.calledWithExactly()).to.be.true;

      expect(mockResponse.redirect.calledOnce).to.be.true;
      expect(mockResponse.redirect.calledWithExactly('/login')).to.be.true;
    });
  });

  describe('the currentuser api endpoint', function () {
    it('should return user user on the session', function () {
      var randomSession = randomObject.newInstance('session');
      randomSession.set('session.user.name');
      var mockRequest = randomSession.getObject();
      var mockResponse = { send: sinon.spy() };

      routes.__set__('router', mockRouter);
      routes();

      var currentUser = mockRouter.get.args[2][1];

      currentUser(mockRequest, mockResponse);

      expect(mockResponse.send.calledOnce).to.be.true;
      randomSession.verify('session.user', mockResponse.send.args[0][0]);
    });
  });

  describe('the register POST handler', function () {
    var mockDb;
    var mockCollection;

    function createMockCollection(contents) {
      var theCollection = {
        find: sinon.spy(function () {
          return theCollection;
        }),
        insert: sinon.spy(function () {
          return Promise.resolve();
        }),
        toArray: sinon.spy(function () {
          return Promise.resolve(contents);
        })
      };

      return theCollection;
    }

    function getOrCreateCollection(name) {
      mockCollection[name] = mockCollection[name] || createMockCollection();

      return mockCollection[name];
    }

    function setupMockDb(users) {
      mockCollection = {};

      mockCollection.users = createMockCollection(users);

      mockDb = {
        connect: function () {
          return Promise.resolve(mockDb);
        },
        collection: sinon.spy(function (collectionName) {
          return getOrCreateCollection(collectionName);
        })
      };

      routes.__set__('db', mockDb);
    }

    describe('if the user doesn\'t already exist', function () {

      var randomUser;

      beforeEach(function () {
        routes.__set__('router', mockRouter);
        setupMockDb([]);
        routes();

        randomUser = randomObject.newInstance('user');
        randomUser.set('firstname');
        randomUser.set('lastname');
        randomUser.set('username');
      });

      it('should create the user and corresponding profile', function (done) {
        var handler = mockRouter.post.args[1][1];
        randomUser.set('nInbox', 1);
        randomUser.set('nSent', 0);
        var user = randomUser.getObject();
        var mockRequest = { body: user, flash: sinon.spy() };

        var mockResponse = { redirect: sinon.spy() };
        handler(mockRequest, mockResponse).then(function () {
          expect(mockCollection.users.insert.calledWithExactly(user)).to.be.true;
          expect(mockCollection.usersFamilyChildrenCaseworker.insert.called).to.be.true;
          done();
        });
      });

      it('should flash a message', function (done) {
        var handler = mockRouter.post.args[1][1];
        var mockRequest = { body: randomUser.getObject(), flash: sinon.spy() };

        var mockResponse = { redirect: sinon.spy() };
        handler(mockRequest, mockResponse).then(function () {
          expect(mockRequest.flash.calledOnce).to.be.true;
          expect(mockRequest.flash.calledWithExactly('info', 'User created. Please login below.')).to.be.true;

          done();
        });
      });

      it('should redirect to /login', function (done) {
        var handler = mockRouter.post.args[1][1];
        var user = randomUser.getObject();
        var mockRequest = { body: user, flash: sinon.spy() };

        var mockResponse = { redirect: sinon.spy() };
        handler(mockRequest, mockResponse).then(function () {
          expect(mockResponse.redirect.calledOnce).to.be.true;
          expect(mockResponse.redirect.calledWithExactly('/login')).to.be.true;

          done();
        });
      });
    });

    describe('if the user already exists', function () {
      var randomUser;

      beforeEach(function () {
        routes.__set__('router', mockRouter);
        setupMockDb([{ user: 'name' }]);
        routes();

        randomUser = randomObject.newInstance('user');
        randomUser.set('firstname');
        randomUser.set('lastname');
        randomUser.set('username');
      });

      it('should flash a warning', function (done) {
        var handler = mockRouter.post.args[1][1];
        var user = randomUser.getObject();
        var mockRequest = { body: user, flash: sinon.spy() };

        var mockResponse = { redirect: sinon.spy() };
        handler(mockRequest, mockResponse).then(function () {
          expect(mockRequest.flash.calledOnce).to.be.true;
          expect(mockRequest.flash.calledWithExactly('warning', 'User already exists')).to.be.true;

          done();
        });
      });

      it('should redirect to /register', function (done) {
        var handler = mockRouter.post.args[1][1];
        var user = randomUser.getObject();
        var mockRequest = { body: user, flash: sinon.spy() };

        var mockResponse = { redirect: sinon.spy() };
        handler(mockRequest, mockResponse).then(function () {
          expect(mockResponse.redirect.calledOnce).to.be.true;
          expect(mockResponse.redirect.calledWithExactly('/register')).to.be.true;

          done();
        });
      });
    });
  });

  describe('the login POST handler', function () {
    it('should use the passport authentication middleware', function () {
      routes.__set__('router', mockRouter);
      routes();

      expect(mockRouter.post.args[0][1]).to.equal(mockAuthenticate);
    });

    it('should set the user on the session', function () {
      var randomRequest = randomObject.newInstance('request');
      randomRequest.set('session', {});
      randomRequest.set('user.name');
      randomRequest.set('body', {});

      var mockRequest = randomRequest.getObject();
      var mockResponse = { redirect: sinon.spy() };

      routes.__set__('router', mockRouter);
      routes();

      var loginHandler = mockRouter.post.args[0][2];

      loginHandler(mockRequest, mockResponse);

      randomRequest.verify('user', mockRequest.session.user);
    });

    it('should redirect to the return url if one is provided', function () {
      var randomRequest = randomObject.newInstance('request');
      randomRequest.set('session', {});
      randomRequest.set('user.name');
      randomRequest.set('body.returnUrl');

      var mockRequest = randomRequest.getObject();
      var mockResponse = { redirect: sinon.spy() };

      routes.__set__('router', mockRouter);
      routes();

      var loginHandler = mockRouter.post.args[0][2];

      loginHandler(mockRequest, mockResponse);

      randomRequest.verify('body.returnUrl', mockResponse.redirect.args[0][0]);
    });

    it('should redirect to / if no return url is provided', function () {
      var randomRequest = randomObject.newInstance('request');
      randomRequest.set('session', {});
      randomRequest.set('user.name');
      randomRequest.set('body', {});

      var mockRequest = randomRequest.getObject();
      var mockResponse = { redirect: sinon.spy() };

      routes.__set__('router', mockRouter);
      routes();

      var loginHandler = mockRouter.post.args[0][2];

      loginHandler(mockRequest, mockResponse);

      expect(mockResponse.redirect.args[0][0]).to.equal('/');
    });
  });

  describe('the authentication function on the POST handler', function () {
    it('should be configured for local authentication', function () {
      routes.__set__('router', mockRouter);
      routes();

      expect(mockPassport.authenticate.args[0][0]).to.equal('local');
    });

    it('should redirect to /login and flash a message on failure', function () {
      routes.__set__('router', mockRouter);
      routes();

      expect(mockPassport.authenticate.args[0][1]).to.be.nonStrictEqual({
        failureRedirect: '/login',
        failureFlash: true
      });
    });
  });
});