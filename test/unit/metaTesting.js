'use strict';

var path = require('path');
var glob = require('glob');
var exec = require('child_process').exec;


describe('If we want to load all the files for test coverage', function () {

  it.skip('re-enable this test', function () {
    ['server', 'koe'].forEach(function (directory) {
      glob.sync(path.resolve(__dirname, '../../', directory, '**/*.js')).forEach(function (filename) {
        if (/app.js$/.test(filename)) {
          return;
        }

        require(filename); // eslint-disable-line global-require
      });
    });
  });
});

describe('If we want to run each test individually rather than as a group', function () {
  describe.skip('re-enable this block', function () {
    glob.sync(path.resolve(__dirname, '**/*.js')).forEach(function (filename) {
      if (/metaTesting.js$/.test(filename)) {
        return;
      }
      it('the ' + filename + ' test', function (done) {
        exec('node_modules/.bin/mocha ' + filename, { cwd: path.resolve(__dirname, '../../') }, done);
      });
    });
  });
});