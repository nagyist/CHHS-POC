'use strict';

var chai = require('chai');
var sinon = require('sinon');
var path = require('path');
var glob = require('glob');

var expect = chai.expect;

var rewire = require('rewire');

var middleware = rewire('../../../../koe/middleware');
var fakeConfig = { fake: true };

var spy = sinon.spy();

describe('the middleware module', function () {
  before(function () {
    middleware.__set__('spoofSecureConnection', spy);
    middleware.__set__('helmet', spy);
    middleware.__set__('cookieParser', spy);
    middleware.__set__('bodyParser', spy);
    middleware.__set__('session', spy);
    middleware.__set__('flash', spy);
    middleware.__set__('templateData', spy);
    middleware.__set__('staticContent', spy);
  });

  it('should initialize all modules with the passed config', function () {
    middleware(fakeConfig);

    expect(spy.callCount).to.equal(8);
    expect(spy.alwaysCalledWith(fakeConfig)).to.be.true;
  });

  it('should expose all files in the middleware folder', function () {
    var dir = path.resolve(__dirname, '../../../../koe/middleware');
    var pattern = path.join(dir, '**/!(index).js');
    var files = glob.sync(pattern).map(function (filename) { return path.basename(filename, '.js'); });

    expect(middleware({})).to.have.all.keys(files);
  });
});