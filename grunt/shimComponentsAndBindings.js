// We use "this.async()" for grunt tasks, so disable the warning.
/*eslint-disable no-invalid-this */
'use strict';

// This task constructs a pair of files containing the details of all bindings and all components within their
// respective directories. These files are then used in the requirejs minification task to allow us to include the
// corresponding files in the minified JS output.

var componentsAndBindings = require('../koe').app.componentsAndBindings;
var fs = require('fs');
var path = require('path');

module.exports = function (grunt) {
  grunt.registerTask("shimComponentsAndBindings", function () {
    var componentsFilePath = path.join(componentsAndBindings.componentsDir, 'components.min.js');
    var bindingsFilePath = path.join(componentsAndBindings.bindingsDir, 'bindings.min.js');

    var componentsDefinition = "define('components', function () { return " + JSON.stringify(componentsAndBindings.findComponents()) + "; });";
    var bindingsDefinition = "define('bindings', function () { return " + JSON.stringify(componentsAndBindings.findBindings()) + "; });";

    fs.writeFileSync(componentsFilePath, componentsDefinition);
    fs.writeFileSync(bindingsFilePath, bindingsDefinition);
  });

  return {};
};
