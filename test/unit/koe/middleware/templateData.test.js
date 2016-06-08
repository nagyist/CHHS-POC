'use strict';

var chai = require('chai');
var sinon = require('sinon');

var expect = chai.expect;

var middleware = require('../../../../koe/middleware/templateData');

var randomObject = require('../../../utils/randomObject');
var noop = function () {};

describe('the templateData middleware', function () {
  var config;

  before(function () {
    config = randomObject.newInstance();
    config.set('dev');
    config.set('livereload');
  });

  it('should return a function', function () {
    expect(middleware).to.be.a('function');
  });

  it('which returns a function', function () {
    expect(middleware()).to.be.a('function');
  });

  it('which overrides the res.render function', function () {
    var res = { render: noop };

    var templateData = middleware();
    templateData({}, res, noop);

    expect(res.render).to.not.equal(noop);
  });

  it('and calls next', function () {
    var next = sinon.spy();

    var templateData = middleware();
    templateData({}, {}, next);

    expect(next.calledOnce).to.be.true;
  });

  describe('the overridden render function', function () {
    var render;
    var res;
    var req;

    beforeEach(function () {
      render = sinon.spy();
      res = { render: render };
      req = { signedCookies: {} };
    });

    it('calls through to the native render', function () {
      middleware(config.getObject())(req, res, noop);

      res.render('whooop', noop);

      expect(render.calledOnce).to.be.true;
    });

    it('passes the original arguments forward to the native render', function () {
      middleware(config.getObject())(req, res, noop);
      var locals = randomObject.newInstance('locals');
      locals.set('local');

      res.render('whooop', locals.getObject(), noop);

      expect(render.calledOnce).to.be.true;
      expect(render.args[0][0]).to.equal('whooop');
      locals.verify('local', render.args[0][1].local);
      expect(render.args[0][2]).to.equal(noop);
    });

    it('initializes an empty locals object if none is provided', function () {
      middleware(config.getObject())(req, res, noop);
      res.render('whooop', noop);
      res.render('whooop', undefined, noop);

      expect(render.args[0][1]).to.be.an('object');
      expect(render.args[1][1]).to.be.an('object');
    });

    it('appends dev, livereload and minify properties onto the locals object', function () {
      middleware(config.getObject())(req, res, noop);
      var locals = randomObject.newInstance('locals');
      locals.set('local');

      res.render('whooop', locals.getObject(), noop);

      expect(render.args[0][1]).to.have.all.keys(['local', 'dev', 'livereload', 'minify']);
    });

    it('populates the dev flag appropriately', function () {
      middleware(config.getObject())(req, res, noop);

      res.render('whooop', noop);

      config.verify('dev', render.args[0][1].dev);
    });

    it('populates the livereload flag appropriately', function () {
      middleware(config.getObject())(req, res, noop);

      res.render('whooop', noop);

      config.verify('livereload', render.args[0][1].livereload);
    });

    describe('the minify flag', function () {
      it('is true when config.minify is truthy and no debug cookie is set', function () {
        config.set('minify');

        middleware(config.getObject())(req, res, noop);

        res.render('whooop', noop);

        expect(render.args[0][1].minify).to.be.true;
      });

      it('is false when config.minify is truthy and the debug cookie is set', function () {
        config.set('minify');
        req.signedCookies.assets = 'debug';

        middleware(config.getObject())(req, res, noop);

        res.render('whooop', noop);

        expect(render.args[0][1].minify).to.be.false;
      });
      
      it('is true when the minify cookie is set', function () {
        req.signedCookies.assets = 'minify';

        middleware(config.getObject())(req, res, noop);

        res.render('whooop', noop);

        expect(render.args[0][1].minify).to.be.true;
      });
    });
  });
});