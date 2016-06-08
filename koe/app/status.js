// We need to require integration files inline
/*eslint-disable global-require */

'use strict';

var path = require('path');
var Promise = require('bluebird');
var _ = require('lodash');
var glob = Promise.promisify(require('glob'));

// Status tests should be in individual files, each of which should export:
// * a test function with a callback takes an error and a result (boolean) as its arguments
// * (optional) a timeout in ms - default 1000
// * (optional) a name
// * (optional) a description
// For each file we call the test function, returning one of ERROR, SUCCESS, FAILURE or TIMEOUT. The results are then
// displayed in the status page.

function integrationStatus(statusTestFile) {

  var ext = path.extname(statusTestFile);
  var basename = path.basename(statusTestFile, ext);
  var statusModule = require(statusTestFile);

  if (statusModule.disabled) {
    return {
      basename: statusModule.name || basename,
      description: statusModule.description,
      status: 'DISABLED'
    };
  }

  var test = Promise.promisify(statusModule.test);

  return test()
    .timeout(statusModule.timeout || 1000)
    .then(function (result) {
      return Promise.resolve(result ? 'SUCCESS' : 'FAILURE');
    }).catch(Promise.TimeoutError, function () {
      return Promise.resolve('TIMEOUT');
    }).catch(function () {
      return Promise.resolve('ERROR');
    }).then(function (result) {
      return {
        basename: statusModule.name || basename,
        description: statusModule.description,
        status: result
      };
    });
}

function getIntegrationStatuses(integrationsDir) {
  if (!integrationsDir) {
    return Promise.resolve([]);
  }

  var pattern = path.join(integrationsDir, '**/*.js');
  return glob(pattern).map(integrationStatus);
}


module.exports = function (config) {

  var integrationsDir = config.status ? config.status.integrationsDir : undefined;

  function getUpDownStatus() {
    return getIntegrationStatuses(integrationsDir).then(function (statusChecks) {
      var result = _.every(statusChecks, function (check) {
        return check.status === 'SUCCESS' || check.status === 'DISABLED';
      });

      return Promise.resolve(result);
    });
  }

  function getFullStatusInfo() {
    return getIntegrationStatuses(integrationsDir);
  }

  return {
    getUpDownStatus: getUpDownStatus,
    getFullStatusInfo: getFullStatusInfo
  };
};
