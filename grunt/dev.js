'use strict';

module.exports = function (grunt) {
  
  var devTasks = [];

  if (grunt.option('no-eslint')) {
    console.log('Skipping "force:eslint" task');
  }
  else {
    devTasks.push('force:eslint');
  }

  devTasks.push('express');
  devTasks.push('less');
  
  if (grunt.option('no-open')) {
    console.log('Skipping "open:dev" task');
  }
  else {
    devTasks.push('open:dev');
  }

  devTasks.push('watch');

  grunt.registerTask('dev', devTasks);

  return {};
};

