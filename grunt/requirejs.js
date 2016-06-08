'use strict';

// Optimize RequireJS projects: https://github.com/gruntjs/grunt-contrib-requirejs

// This builds up a single minified js file containing everything we need to run the application.
// We do this by concatenating (in order):
// * Any scripts loaded in the page header
// * Require.js
// * The text plugin for loading component templates
// * All component and binding files
// * The client app.js script
// Any other dependencies are automatically populated based on the require-config.js file

var path = require('path');
var koe = require('../koe');
var componentsAndBindings = koe.app.componentsAndBindings;

var includedFiles = ['js/fixConsoleForOldBrowsers', 'bower_components/requirejs/require', 'require-config', 'text']
  .concat(componentsAndBindings.allFiles)
  .concat(['js/app']);

var inlineDefines = koe.utils.requireRoot('inline-defines.json', []);
var paths = {};

inlineDefines.forEach(function (def) {
  paths[def] = 'empty:';
});
paths['api/appSettings'] = 'empty:';

module.exports = {
  compile: {
    options: {
      baseUrl: 'client',
      mainConfigFile: path.resolve('./client/require-config.js'),
      paths: paths,
      map: {
        'js/app': {
          components: 'components/components.min',
          bindings: 'bindings/bindings.min'
        }
      },
      include: includedFiles,
      name: 'js/app',
      out: 'client/app.min.js',
      insertRequire: ['js/app'],
      findNestedDependencies: true,
      preserveLicenseComments: false,
      optimize: 'uglify2'
    }
  }
};

