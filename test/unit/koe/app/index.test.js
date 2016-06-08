'use strict';

var chai = require('chai');
var sinon = require('sinon');
var glob = require('glob');
var path = require('path');

var expect = chai.expect;

var rewire = require('rewire');

var app = rewire('../../../../koe/app');
var fakeConfig = { fake: true };
var spy = sinon.spy();

describe('the app module', function () {
  before(function () {
    app.__set__('appInfo', spy);
    app.__set__('componentsAndBindings', spy);
    app.__set__('handlebarsRenderingEngine', spy);
    app.__set__('sslCredentials', spy);
    app.__set__('status', spy);
  });

  it('should initialize all modules with the passed config', function () {
    app(fakeConfig);

    expect(spy.callCount).to.equal(5);
    expect(spy.alwaysCalledWith(fakeConfig)).to.be.true;
  });

  it('should expose all files in the app folder', function () {
    var dir = path.resolve(__dirname, '../../../../koe/app');
    var pattern = path.join(dir, '**/!(index).js');
    var files = glob.sync(pattern).map(function (filename) { return path.basename(filename, '.js'); });

    expect(app({})).to.have.all.keys(files);
  });
});