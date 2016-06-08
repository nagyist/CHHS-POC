"use strict";

// This constructs a single config object with nested properties, based on a hierarchy of files etc.:

// koe/koeDefaultConfig.js  - defines the bare minimum default config for an application to run in dev, defining things
//                            such as the application folder structure, default session secrets, application ports etc.
// config.js (optional)     - defines additional application-specific configuration. Can either be a simple object, or
//                            can export a baseConfig object and an environments object which should be contain further
//                            objects keyed on environment name.
// [env].json (optional)    - a plain json object defining the config for the current environment
// Environment Variables    - any system environment variables will take priority over configured values. The names are
//                            automatically parsed for object traversal - e.g. FOO_BAR would overwrite config.foo.bar

var _ = require('lodash');
var requireRoot = require('./utils/requireRoot');

// Default to dev
var configEnv = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Load up our hierarchy of files
var defaultConfig = require('./koeDefaultConfig');

// This is almost analogous to lodash's merge function, but we want to ensure that *all* properties are merged over,
// including ones whose values are undefined in the new source object.
function merge(destination, source) {
  _.forOwn(source, function (v, k) {
    if (_.isPlainObject(v)) {
      destination[k] = merge(destination[k] || {}, v);
    } else {
      destination[k] = v;
    }
  });

  return destination;
}

function replaceEnvironmentProperties(obj, prefix) {
  var keys = _.keys(obj);

  function getKey(key) {
    var prefixedKey = prefix ? [prefix, key].join('_'): key;
    var snakeCasedKey = _.snakeCase(prefixedKey);
    return snakeCasedKey.toUpperCase();
  }

  function evaluateEnvironmentVariable(key) {
    var stringValue = process.env[getKey(key)];
    try {
      return eval(stringValue);
    } catch (e) {
      return stringValue;
    }
  }

  _.forEach(keys, function (key) {
    if (!_.isPlainObject(obj[key])) {
      obj[key] = process.env.hasOwnProperty(getKey(key)) ? evaluateEnvironmentVariable(key) : obj[key];
    } else {
      replaceEnvironmentProperties(obj[key], getKey(key));
    }
  });
}

module.exports = function () {
  var configFile = requireRoot('config', {});
  var environmentFile = requireRoot(configEnv + '.json', {});

  // Extract base and environments from config.js if it exists
  var baseConfig = configFile.hasOwnProperty('baseConfig') ? configFile.baseConfig : configFile;
  var environments = configFile.hasOwnProperty('baseConfig') && configFile.hasOwnProperty('environments') ? configFile.environments : {};
  var environmentOverrides = environments[configEnv] || {}; // overwrite environment values on the base config

  // Apply our overrides in order
  var config = merge({}, defaultConfig);
  config = merge(config, baseConfig);
  config = merge(config, environmentOverrides);
  config = merge(config, environmentFile);


  // overwrite config values with corresponding environment variables if present
  replaceEnvironmentProperties(config);

  // Ensure that the environment is added last and can't be overridden
  config.environment = configEnv;

  return config;
};
