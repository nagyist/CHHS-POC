'use strict';

var chai = require('chai');
var path = require('path');
var glob = require('glob');

var expect = chai.expect;

var utils = require('../../../../koe/utils');

describe('the utils module', function () {
  it('should expose all files in the utils folder', function () {
    var dir = path.resolve(__dirname, '../../../../koe/utils');
    var pattern = path.join(dir, '**/!(index).js');
    var files = glob.sync(pattern).map(function (filename) { return path.basename(filename, '.js'); });

    expect(utils).to.have.all.keys(files);
  });
});