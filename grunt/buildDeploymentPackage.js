'use strict';

// Defines all the grunt tasks required to create a fresh minimal deployment package

var _ = require('lodash');
var path = require('path');
var exec = require('child_process').exec;

var syncConfig = require('../sync-config.json');

var baseUrl = path.resolve(__dirname, '../client');
var bowerComponentsFolder = 'bower_components';
var bowerConfigPath = path.resolve(__dirname, '../bower.json');
var bowerConfig = require(bowerConfigPath);
var bowerComponentNames = _.keys(bowerConfig.dependencies);

function getBowerModuleMainFiles(componentName) {
  // We use .bower.json rather than bower.json as we can guarantee the latter will always be present and consistent.
  // See https://github.com/bower/bower/issues/1174
  var bowerJsonPath = path.join(baseUrl, bowerComponentsFolder, componentName, '.bower.json');
  var bowerJson = require(bowerJsonPath); // eslint-disable-line global-require

  if (_.isString(bowerJson.main)) {
    return path.join(bowerComponentsFolder, componentName, bowerJson.main);
  }

  return _.map(bowerJson.main, function (filename) {
    return path.join(bowerComponentsFolder, componentName, filename);
  });
}

// Determine the appropriate files to include from bower_components
var bowerPaths = _(bowerComponentNames).map(getBowerModuleMainFiles).flatten().value();

module.exports = function (grunt) {

  grunt.registerTask('npmProdInstall', 'Install prod dependencies inside the dist folder', function () {
    var distPath = path.resolve(__dirname, '..', 'dist');
    var done = this.async();
    exec('npm install --production --ignore-scripts', { cwd: distPath }, function (err, stdout) {
      if (err) {
        return done(err);
      }
      console.log(stdout);
      done();
    });
  });

  grunt.registerTask('minify', ['less', 'cssmin', 'shimComponentsAndBindings', 'requirejs:compile']);
  grunt.registerTask('buildDeploymentPackage', ['buildProperties', 'minify', 'sync', 'npmProdInstall']);

  return {
    tasks: {
      clean: ['dist'],
      sync: {
        clientContent: {
          files: [{
            cwd: 'client',
            src: [].concat(syncConfig.client).concat(bowerPaths),
            dest: 'dist/client'
          }]
        },
        serverContent: {
          files: [{
            cwd: 'server',
            src: syncConfig.server,
            dest: 'dist/server'
          }]
        },
        koe: {
          files: [{
            cwd: 'koe',
            src: syncConfig.koe,
            dest: 'dist/koe'
          }]
        },
        configFiles: {
          files: [{
            src: syncConfig.config,
            dest: 'dist'
          }]
        }
      }
    }
  };
};