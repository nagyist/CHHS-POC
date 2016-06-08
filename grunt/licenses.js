'use strict';

var _ = require('lodash');
var fs = require('fs');
var nlf = require('nlf');
var bowerLicenseChecker = require('bower-license');

var prettyPrint = function(x) { return JSON.stringify(x, null, 2); };

module.exports = function (grunt) {

  grunt.registerTask('licenses', function() {
    // this.async comes from grunt.
    var done = this.async();
    nlf.find({ directory: './' }, function (err, npmPackages) {

      if (err) {
        return done(err);
      }

      // Convert giant package license output to { express: ['MIT', 'BSD'], lodash: [ 'MIT' ] }
      var npmLicensesByPackage = _.map(npmPackages, function(p) {
        return _.zipObject([p.id], [_.pluck(p.licenseSources.package.sources, 'license')]);
      });
      var npmLicensesObject = _.assign.apply(_, npmLicensesByPackage);
      fs.writeFileSync('npmLicenses.json', prettyPrint(npmLicensesObject));
      var distinctNpmLicenses = _.chain(npmLicensesObject).values().flattenDeep().uniq().sort().value();
      console.log('Distinct licenses of NPM packages:');
      console.log(prettyPrint(distinctNpmLicenses));
      console.log('See npmLicenses.json for a more detailed view');

      bowerLicenseChecker.init({ directory: './client/bower_components' }, function(bowerLicenses){
        fs.writeFileSync('bowerLicenses.json', prettyPrint(bowerLicenses));
        var distinctBowerLicenses = _.chain(bowerLicenses).values().pluck('licenses').flattenDeep().uniq().sort().value();
        console.log('Distinct licenses of Bower packages:');
        console.log(prettyPrint(distinctBowerLicenses));
        console.log('See bowerLicenses.json for a more detailed view');
        done();
      });
    });
  });

  return {};
};
