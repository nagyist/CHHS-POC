'use strict';

var _ = require('lodash');

// Automatically add core page info to response.locals, so that it can be accessed by the rendering engine
module.exports = function (config) {

  return function templateData(req, res, next) {

    // Override the render call so that we can append to the page model defined on the route, rather than pre-setting
    // locals which might be subsequently overridden
    var _render = res.render;
    res.render = function (view, locals, callback) {
      if (typeof locals === 'function') {
        callback = locals;
        locals = {};
      }

      var responseDataToAdd = {
        dev: config.dev,
        livereload: config.livereload,
        minify: (config.minify && req.signedCookies.assets !== 'debug') || req.signedCookies.assets === 'minify' // eslint-disable-line no-extra-parens
      };

      locals = _.merge(locals || {}, responseDataToAdd);

      _render.call(res, view, locals, callback);
    };

    next();
  };
};
