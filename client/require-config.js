/*global requirejs*/
requirejs.config({
  paths: {
    text: 'bower_components/text/text',
    json: 'bower_components/requirejs-plugins/src/json',
    jquery: 'bower_components/jquery/dist/jquery',
    knockout: 'bower_components/knockout/dist/knockout',
    pager: 'bower_components/pagerjs/pager',
    bootstrap: 'bower_components/bootstrap/dist/js/bootstrap', // must be placed after pager
    lodash: 'bower_components/lodash/lodash', 
    'bootstrap-datepicker': 'bower_components/bootstrap-datepicker/js/bootstrap-datepicker',
    select2: 'bower_components/select2/select2',
    jreject: 'bower_components/jreject/js/jquery.reject',
    'ow-colors': 'js/ow-colors',
    // leaflet: 'bower_components/leaflet/dist/leaflet-src',
    mapbox: 'bower_components/mapbox.js/mapbox',
    moment: 'bower_components/moment/moment',
    fullCalendar: 'bower_components/fullcalendar/dist/fullcalendar'
  },
  shim: {
    'bootstrap': {
      deps: ['jquery']
    },
    'bootstrap-datepicker': {
      deps: ['bootstrap']
    },
    'select2': {
      deps: ['jquery']
    },
    jreject: {
      deps: ['jquery']
    },
    mapbox: {
      exports: 'L'
    },
    fullCalendar: {
      deps:['jquery','moment']
    }
    // 'mapbox': {
    //   deps: ['leaflet']
    // }
  }
});