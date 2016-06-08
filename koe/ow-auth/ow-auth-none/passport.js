'use strict';

function doNothing(req, res, next) {
  return next();
}

module.exports = function() {
  
  // Return a dummy passport placeholder, does nothing.
  return {
    initialize: function() {
      return doNothing;
    },
    authenticate: function() {
      return doNothing;
    },
    session: function() {
      return doNothing;
    }
  };

};
