'use strict';

// compiles Less into CSS

module.exports = {
  development: {
    options: {
      paths: [
        'client/css/less',
        'client/css/less/**'
      ],
      // source maps make it easier to debug compiled CSS in DevTools
      sourceMap: true,
      sourceMapFilename: 'client/css/core.css.map',
      sourceMapURL: '/css/core.css.map',
      sourceMapBasepath: 'client/css'
    },
    files: {
      'client/css/core.css': 'client/css/less/core.less'
    }
  }
  // , production: {} (here if we need it)
};
