'use strict';

// This file has been left in as an example file for now until a more useful one (e.g. checking ADFS is up) can be written
// It shouldn't be activated because ping doesn't have a -c option on windows, so it will always register as an error.

var exec = require('child_process').exec;

module.exports.name = 'Network';
module.exports.description = 'verifies a basic connection to the internet by pinging google.com';
module.exports.disabled = true;

module.exports.test = function (done) {
  exec('ping -c 1 www.google.com', { cwd: __dirname }, function (err, stdout) {
    return done(err, !!stdout.replace(/\s/g, '').match(/64bytes/));
  });
};

module.exports.timeout = 500;