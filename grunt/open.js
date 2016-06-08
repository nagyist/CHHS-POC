'use strict';

// Opens browser to page on start

module.exports = function (grunt) {
  var port = process.env.PORT || 9001;

  // Set port via argument, overrides default & environment setting.
  if (grunt.option('port') !== undefined) {
    port = grunt.option('port');
  }

  return {
    dev: {
      path: 'http://localhost:' + port
    }
  };
};
