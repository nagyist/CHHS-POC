'use strict';

// Minifies CSS files: https://github.com/gruntjs/grunt-contrib-cssmin

module.exports = {
  target: {
    files: {
      'client/css/site.min.css': [
        'client/css/core.css',
        'client/css/custom.css',
        'client/bower_components/jreject/css/jquery.reject.css',
        'client/bower_components/mapbox.js/mapbox.css',
        'client/bower_components/fullcalendar/dist/fullcalendar.css'
      ]
    }
  }
};
