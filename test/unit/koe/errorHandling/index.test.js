'use strict';

var chai = require('chai');
var sinon = require('sinon');
var path = require('path');
var glob = require('glob');

var expect = chai.expect;

var rewire = require('rewire');

var errorHandling = rewire('../../../../koe/errorHandling');
var fakeConfig = { fake: true };
var fakeLogger = { log: false };

var spy = sinon.spy();

describe('the errorHandling module', function () {
  before(function () {
    errorHandling.__set__('defaultErrorHandler', spy);
  });

  it('should initialize all error handling modules with the passed config and logger', function () {
    errorHandling(fakeConfig, fakeLogger);

    expect(spy.callCount).to.equal(1);
    expect(spy.alwaysCalledWith(fakeConfig, fakeLogger)).to.be.true;
  });

  it('should expose all files in the errorHandling folder', function () {
    var dir = path.resolve(__dirname, '../../../../koe/errorHandling');
    var pattern = path.join(dir, '**/!(index).js');
    var files = glob.sync(pattern).map(function (filename) { return path.basename(filename, '.js'); });

    expect(errorHandling({})).to.have.all.keys(files);
  });
});