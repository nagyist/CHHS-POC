'use strict';

var path = require('path');
var _ = require('lodash');

var requireRoot = require('./../utils/requireRoot');
var flattenObject = require('./../utils/flattenObject');

var now = new Date(); // This will cycle with process startup/shutdown

function getNPMDependencyVersion(depname) {
  var depPackageJson = requireRoot(path.join('node_modules', depname, 'package.json'));
  return depPackageJson.version;
}

function getBowerDependencyVersion(depname, baseDir) {
  var depBowerJson = requireRoot(path.join(baseDir, 'bower_components', depname, '.bower.json'));
  return depBowerJson.version;
}

function getServerDependencies() {
  var packageJson = requireRoot('package.json');

  return _.map(packageJson.dependencies, function (version, depname) {
    return {
      depname: depname,
      configuredVersion: version,
      installedVersion: getNPMDependencyVersion(depname)
    };
  });
}

function getClientDependencies(baseDir) {
  var bowerJson = requireRoot('bower.json');

  return _.map(bowerJson.dependencies, function (version, depname) {
    return {
      depname: depname,
      configuredVersion: version,
      installedVersion: getBowerDependencyVersion(depname, baseDir)
    };
  });
}

function sanitizeConfig(config, sensitiveConfigValues) {

  var flattenedConfig = flattenObject(config);
  return _.filter(flattenedConfig, function (conf) {
    return !_.includes(sensitiveConfigValues, conf.key);
  });
}

module.exports = function (config) {
  var buildProperties = requireRoot('build-properties.json', {});
  var sensitiveConfigValues = requireRoot('sensitive-config-values.json', []);

  var serverDependencies = getServerDependencies();
  var clientDependencies = getClientDependencies(config.static.baseDir);
  var sanitizedConfig = sanitizeConfig(config, sensitiveConfigValues);

  return _.merge(buildProperties, {
    startupTime: now,
    serverDependencies: serverDependencies,
    clientDependencies: clientDependencies,
    config: sanitizedConfig
  });
};
