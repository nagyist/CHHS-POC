'use strict';

var chai = require('chai');
var sinon = require('sinon');
var rewire = require('rewire');

var owAuthModule = rewire('../../../../server/ow-auth-db/');

var nonStrictEquality = require('../../../utils/nonStrictEquality');
chai.use(nonStrictEquality);

var expect = chai.expect;
describe('the ow-auth-db parent module', function () {

  it('should return a function', function () {
    expect(owAuthModule).to.be.a('function');
  });

  describe('initialization', function () {
    var mockAuth;
    var passport;
    var ensureAuthenticated = { something: 'whatever' };
    var routes = { who: 'cares' };

    beforeEach(function () {
      passport = {
        initialize: sinon.spy(function () {
          return { yes: 'no' };
        }),
        session: sinon.spy(function () {
          return { no: 'maybe' };
        })
      };

      mockAuth = {
        passport: sinon.spy(function () {
          return passport;
        }),
        ensureAuthenticated: sinon.spy(function () {
          return ensureAuthenticated;
        }),
        routes: sinon.spy(function () {
          return routes;
        })
      };

      owAuthModule.__set__(mockAuth);
    });

    it('should initialize all modules with the koe config and paths', function () {
      var fakeConfig = { fake: true };
      var fakePaths = { paths: ['fake'] };

      owAuthModule(fakeConfig, fakePaths);

      expect(mockAuth.passport.calledOnce).to.be.true;
      expect(mockAuth.passport.calledWithExactly(fakeConfig, fakePaths)).to.be.true;

      expect(mockAuth.ensureAuthenticated.calledOnce).to.be.true;
      expect(mockAuth.ensureAuthenticated.calledWithExactly(fakeConfig, fakePaths)).to.be.true;

      expect(mockAuth.routes.calledOnce).to.be.true;
      expect(mockAuth.routes.calledWithExactly(fakeConfig, fakePaths)).to.be.true;
    });

    it('should return an initialize function', function () {
      var auth = owAuthModule();
      expect(auth).to.have.all.keys('initialize');
      expect(auth.initialize).to.be.a('function');
    });

    describe('the initialize function', function () {
      it('should initialize passport and the passport session', function () {
        owAuthModule().initialize();

        expect(mockAuth.passport().initialize.calledOnce).to.be.true;
        expect(mockAuth.passport().session.calledOnce).to.be.true;
        expect(mockAuth.passport().initialize.calledWithExactly()).to.be.true;
        expect(mockAuth.passport().session.calledWithExactly()).to.be.true;
      });

      it('should return the initalized passport, session, ensureAuthenticated method and routes', function () {
        var ret = owAuthModule().initialize();

        expect(ret[0]).to.be.nonStrictEqual({ yes: 'no' });
        expect(ret[1]).to.be.nonStrictEqual({ no: 'maybe' });
        expect(ret[2]).to.equal(ensureAuthenticated);
        expect(ret[3]).to.equal(routes);
      });
    });
  });
});