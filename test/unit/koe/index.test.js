'use strict';

var chai = require('chai');
var requireRoot = require('../../../koe/utils/requireRoot');

var expect = chai.expect;


describe('the koe loader', function () {
  var koe;

  before(function () {
    requireRoot.setTestMode('../../test/fixtures/koe');
    koe = require('../../../koe');  // eslint-disable-line global-require
  });

  after(function () {
    requireRoot.setTestMode(false);
  });

  it('should load up an instance of our knockout express library', function () {
    expect(koe).to.have.all.keys('app', 'middleware', 'errorHandling', 'utils', 'config', 'logger', 'auth');
  });
});