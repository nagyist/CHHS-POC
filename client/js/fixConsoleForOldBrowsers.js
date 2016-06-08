// Avoid `console` errors in browsers that lack a console (for example, IE 9: http://stackoverflow.com/questions/7742781/why-javascript-only-works-after-opening-developer-tools-in-ie-once). 
// The code below is from the HTML 5 Boilerplate project: https://github.com/h5bp/html5-boilerplate/blob/master/src/js/plugins.js
(function() {
  var method;
  var noop = function () {};
  var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = window.console = window.console || {};

  while (length--) {
    method = methods[length];

        // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }
}());