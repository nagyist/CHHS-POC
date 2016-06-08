'use strict';

module.exports = function (config) {

  return function spoofSecureConnection(req, res, next) {
    // The request.connection property has disappeared in recent node/express versions, but is still used
    // by express-session to determine whether the session cookie should be set with the secure flag.
    // This middleware puts the property back in if it doesn't already exist.
    if (typeof req.connection === "undefined") {
      req.connection = {};
    }
    if (typeof req.connection.encrypted === "undefined") {
      req.connection.encrypted = config.secure;
    }
    next();
  };
};
