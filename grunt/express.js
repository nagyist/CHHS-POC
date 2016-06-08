'use strict';

// starts the express server

module.exports = function (grunt) {
  var port = process.env.PORT || 9001;

  // Set port via argument, overrides default & environment setting.
  if (grunt.option('port') !== undefined) {
    port = grunt.option('port');
  }

  var disableDebug = grunt.option('disableDebug');
  if (disableDebug) {
    console.log('Disabling debug...');
  }

  return {
    options: {
      port: port
    },
    dev: {
      options: {
        script: 'server/app.js',
        debug: !disableDebug,
        node_env: 'dev'
      }
    }
  };
};