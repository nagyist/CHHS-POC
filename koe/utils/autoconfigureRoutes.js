'use strict';

// This file uses convention-based setup to automatically set up routes based on the files present in the configured
// routes directory. Specifically:
// Any js files in the routes directory will be mounted relative to /[path]/[to]/[filename]
// If the filename is index.js, we assume that it should be mounted on /[path]/[to]/
//
// Note that it is possible to create naming collisions if we have e.g. app.use('/api', ...) declared in index.js and
// app.use('/', ...) declared in /api/index.js

var express = require('express');
var glob = require('glob');
var path = require('path');
var _ = require('lodash');

module.exports = function autoconfigureRoutes (basedir, logger) {
  var router = express.Router();
  var pattern = path.join(basedir, '**/*.js');

  // Iterate over all found files
  glob.sync(pattern).map(function(filename) {

    // Find the path to the file from the base directory
    var relativePath = path.relative(basedir, filename);

    // Determine the filename for mounting
    var extname = path.extname(relativePath);
    var basename = path.basename(relativePath, extname);

    // if the file is called 'index' we should treat it as blank
    if (basename === 'index') {
      basename = '';
    }

    // Get the nested folder structure inside the routes directory
    var dirname = path.dirname (relativePath);
    if (dirname === '.') {
      dirname = '';
    }

    // Combine the folder path with the filename to get the final mount point
    var routePath = path.join(dirname, basename);
    if (routePath === '.') {
      routePath = '';
    }

    // Ensure that we have forward slashes in our definition, regardless of file system
    var routeUrl = routePath.replace(new RegExp(_.escapeRegExp(path.sep), 'g'), '/');

    logger.info('Adding routes on /' + routeUrl);

    // Mount the file
    router.use('/' + routeUrl, require(filename)); // eslint-disable-line global-require
  });

  return router;
};
