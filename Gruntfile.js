'use strict';

var loadGruntTasks = require('load-grunt-tasks');
var loadGruntConfigs = require('load-grunt-configs');

module.exports = function(grunt) {

  // Load grunt tasks automatically
  loadGruntTasks(grunt);

  var options = {
    config: {
      src: './grunt/*.js'
    },
    pkg: grunt.file.readJSON('package.json')
  };

  var configs = loadGruntConfigs(grunt, options);

  // Project configuration.
  grunt.initConfig(configs);

  grunt.registerTask('default', 'dev');
};