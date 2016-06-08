'use strict';

var chai = require('chai');
var sinon = require('sinon');
var ensureAuthenticated = require('../../../../server/ow-auth-db/ensureAuthenticated');

var expect = chai.expect;

describe('ow-auth-db ensureAuthenticated', function () {
  it('should be a function', function () {
    expect(ensureAuthenticated).to.be.a('function');
  });

  it('which returns a function', function () {
    expect(ensureAuthenticated()).to.be.a('function');
  });

  describe('the ensureAuthenticated middleware function', function () {
    describe('when the user is authenticated', function () {
      it('should simply call next', function () {
        var req = {
          isAuthenticated: function () { return true; }
        };
        var next = sinon.spy();

        ensureAuthenticated()(req, undefined, next);

        expect(next.calledOnce).to.be.true;
        expect(next.calledWithExactly()).to.be.true;
      });
    });

    describe('when the user is not authenticated, but the path is public', function () {
      it('should simply call next', function () {
        var req = {
          isAuthenticated: function () { return false; },
          path: 'path'
        };
        var next = sinon.spy();

        ensureAuthenticated(undefined, { public: ['path']})(req, undefined, next);

        expect(next.calledOnce).to.be.true;
        expect(next.calledWithExactly()).to.be.true;
      });
    });

    describe('when the user is not authenticated and the path is not public', function () {
      it('redirects to /login', function () {
        var req = {
          isAuthenticated: function () { return false; },
          originalUrl: 'something/something/something',
          path: 'path'
        };
        var res = { redirect: sinon.spy() };
        var next = sinon.spy();

        ensureAuthenticated(undefined, { public: []})(req, res, next);

        expect(next.calledOnce).to.be.false;
        expect(res.redirect.calledOnce).to.be.true;
        expect(res.redirect.args[0][0]).to.match(/^\/login\?/);
      });

      it('appends the original URL to the query string as a URL-encoded value', function () {
        var req = {
          isAuthenticated: function () { return false; },
          originalUrl: 'something/something/something',
          path: 'path'
        };
        var res = { redirect: sinon.spy() };
        var next = sinon.spy();

        ensureAuthenticated(undefined, { public: []})(req, res, next);

        expect(next.called).to.be.false;
        expect(res.redirect.calledOnce).to.be.true;
        expect(res.redirect.args[0][0]).to.match(/\?returnUrl=something%2Fsomething%2Fsomething$/);
      });
    });
  });
});