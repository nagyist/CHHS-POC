// We are extending the standard require() function, so disable the warning.
/*eslint-disable global-require */

'use strict';

var path = require('path');

var testMode = false;
var testRoot;

function getFullFilePath(rootPath, name) {
  return path.join(testMode ? testRoot : rootPath, name);
}

// Returns a required module from the application base directory.
// @param name - the name of the file or module to require
// @param defaultValue - if truthy and the file isn't found we swallow the error and return the defaultValue instead
var requireRoot = function requireRoot(name, defaultValue) {
  // We assume this is being called from inside the standard koe app structure.
  var rootPath = path.resolve(__dirname, '../..');
  var filePath = path.isAbsolute(name) ? name : getFullFilePath(rootPath, name);

  try {
    return require(filePath);
  } catch (e) {
    if (defaultValue && e.code === 'MODULE_NOT_FOUND') {
      return defaultValue;
    } else {
      throw e;
    }
  }
};

requireRoot.setTestMode = function (isTestMode, root) {
  if (!root && typeof isTestMode === 'string') {
    root = isTestMode;
    isTestMode = true;
  }
  testMode = isTestMode;
  testRoot = root;
};

module.exports = requireRoot;
