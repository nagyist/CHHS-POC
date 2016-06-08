'use strict';

var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;

module.exports = function (grunt) {

  grunt.registerTask('buildProperties', 'Writes build properties to a file', function () {
    var filePath = path.resolve(__dirname, '..', 'build-properties.json');
    var done = this.async();
    exec('git rev-parse HEAD', { cwd: __dirname }, function (err, stdout) {
      var buildProperties = {
        buildTime: new Date(),
        buildNumber: process.env.BUILD_NUMBER // this comes from Jenkins CI
      };

      if (!err) {
        // Error implies this is not a git repo
        buildProperties.revision = stdout.replace(/\s/g, '');
      }

      fs.writeFile(filePath, JSON.stringify(buildProperties), done);
    });
  });

  return {};
};
