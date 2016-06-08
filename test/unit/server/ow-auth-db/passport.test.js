'use strict';

var chai = require('chai');
var sinon = require('sinon');
var rewire = require('rewire');
var Promise = require('bluebird');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var passport = rewire('../../../../server/ow-auth-db/passport');
var nonStrictEquality = require('../../../utils/nonStrictEquality');
chai.use(nonStrictEquality);

var expect = chai.expect;

// ensure we have a logger declared globally before we try to rewire it
global.logger = global.logger || {};

describe('ow-auth-db passport', function () {
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

  describe('passport initialization', function () {
    var mockPassport;
    beforeEach(function () {
      mockPassport = {
        serializeUser: sinon.spy(),
        deserializeUser: sinon.spy(),
        use: sinon.spy()
      };

      passport.__set__('passport', mockPassport);
    });

    it('sets up user serialization as a simple JSON.stringify', function () {
      passport();
      var done = sinon.spy();

      expect(mockPassport.serializeUser.calledOnce).to.be.true;
      expect(mockPassport.serializeUser.args[0][0]).to.be.a('function');

      var serialize = mockPassport.serializeUser.args[0][0];
      serialize({ watching: 'netflix', writing: 'unit tests' }, done);

      expect(done.calledOnce).to.be.true;
      expect(done.args[0][0]).to.be.null;
      expect(done.args[0][1]).to.equal('{"watching":"netflix","writing":"unit tests"}');
    });

    it('sets up user deserialization as a simple JSON.parse', function () {
      passport();
      var done = sinon.spy();

      expect(mockPassport.deserializeUser.calledOnce).to.be.true;
      expect(mockPassport.deserializeUser.args[0][0]).to.be.a('function');

      var deserialize = mockPassport.deserializeUser.args[0][0];
      deserialize('{"watching":"netflix","writing":"unit tests"}', done);

      expect(done.calledOnce).to.be.true;
      expect(done.args[0][0]).to.be.null;
      expect(done.args[0][1]).to.be.nonStrictEqual({ watching: 'netflix', writing: 'unit tests' });
    });

    it('uses the configured local strategy', function () {
      var strategy = { strategy: 'very strategic, yes' };
      var localStrategy = sinon.spy(function () {
        return strategy;
      });

      passport.__with__('localStrategy', localStrategy)(function () {
        passport();

        expect(localStrategy.calledOnce).to.be.true;
        expect(localStrategy.calledWithNew()).to.be.true;

        expect(mockPassport.use.calledOnce).to.be.true;
        expect(mockPassport.use.args[0][0]).to.equal(strategy);
      });
    });
  });

  describe('the local strategy', function () {
    var localStrategy;
    beforeEach(function () {
      localStrategy = sinon.spy();
      passport.__set__('localStrategy', localStrategy);
    });

    it('should be configured to pass the incoming request to the callback', function () {
      passport();

      expect(localStrategy.args[0][0]).to.be.nonStrictEqual({ passReqToCallback: true });
    });

    it('should take a verification callback as its second argument', function () {
      passport();

      expect(localStrategy.args[0][1]).to.be.a('function');
    });

    describe('the verification function', function () {
      var mockLogger;

      beforeEach(function () {
        mockLogger = { error: sinon.spy(), info: sinon.spy() };
        passport.__set__('logger', mockLogger);
      });

      function setupMockDb(users) {
        var mockDb = {
          connect: function () {
            return Promise.resolve(mockDb);
          },
          collection: sinon.spy(function () {
            return mockDb;
          }),
          find: sinon.spy(function () {
            return mockDb;
          }),
          toArray: sinon.spy(function () {
            return users;
          })
        };

        passport.__set__('db', mockDb);
      }

      describe('if the user credentials are correct', function () {
        it('should call done() with the user object', function (done) {
          var users = [{ user: 'name' }];
          setupMockDb(users);

          passport();
          var func = localStrategy.args[0][1];

          func(undefined, 'bob', 'bob', function (err, usr) {
            expect(err).to.be.null;
            expect(usr).to.equal(users[0]);

            done();
          });
        });

        it('should log details on successful login', function (done) {
          var users = [{ user: 'name' }];
          setupMockDb(users);

          passport();
          var func = localStrategy.args[0][1];

          func(undefined, 'bob', 'bob', function () {
            expect(mockLogger.info.calledOnce).to.be.true;
            expect(mockLogger.info.args[0][0]).to.equal('User successfully authenticated');
            expect(mockLogger.info.args[0][1]).to.be.nonStrictEqual({ username: 'bob' });

            done();
          });
        });
      });

      describe('if the credentials are incorrect', function () {
        var func;
        var mockRequest;

        beforeEach(function () {
          setupMockDb([]);

          passport();
          func = localStrategy.args[0][1];
          mockRequest = {
            flash: sinon.spy(function (field, msg) {
              return { field: field, msg: msg };
            })
          };
        });

        it('should call done with no user', function (done) {
          func(mockRequest, 'bill', 'ben', function (err, usr) {
            expect(err).to.be.null;
            expect(usr).to.be.false;

            done();
          });
        });

        it('should flash a warning message', function (done) {
          func(mockRequest, 'bill', 'ben', function (e, u, flash) {
            expect(mockRequest.flash.calledOnce).to.be.true;
            expect(mockRequest.flash.calledWithExactly('warning', 'Invalid username. Are you registered?')).to.be.true;

            expect(flash).to.not.be.null;
            done();
          });
        });

        it('should log an error message', function (done) {
          func(mockRequest, 'bill', 'ben', function () {
            expect(mockLogger.error.calledOnce).to.be.true;
            expect(mockLogger.error.args[0][0]).to.equal('User not found for username');
            expect(mockLogger.error.args[0][1]).to.be.nonStrictEqual({ username: 'bill' });

            done();
          });
        });
      });
    });
  });
});