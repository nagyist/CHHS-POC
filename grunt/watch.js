'use strict';

// watches application file for changes, and reloads/refreshes application if it finds any

module.exports = function (grunt) {
  var disableLiveReload = grunt.option('disableLiveReload');
  if (disableLiveReload) {
    console.log('Disabling live-reload...');
  } else {
    process.env.LIVERELOAD = true;
  }
  
  var expressTasks = ['express:dev'];

  var noEslint = grunt.option('no-eslint');
  if (noEslint) {
    console.log('Disabling automatic eslint...');
  }
  else {
    expressTasks.push('eslint');
  }

  return {
    options: {
      livereload: !disableLiveReload
    },
    express: {
      files: ['server/**/*.js'],
      tasks: expressTasks,
      options: {
        spawn: false
      }
    },
    styles: {
      files: ['client/css/**/*.less'],
      tasks: ['less'],
      options: {
        nospawn: true,
        livereload: !disableLiveReload
      }
    },
    pages: {
      files: ['server/**/*.hbs']
    },
    public: {
      files: [
        'client/*.html',
        'client/**/*.html',
        'client/**/*.js',
        // Prevent node from watching all bower and node package .js files, which takes up a lot of CPU:
        '!client/bower_components/**/*.js',
        '!node_modules/**/*.js',
        'client/css/*.css',
        'client/css/**/*.less'
      ]
    }
  };
};