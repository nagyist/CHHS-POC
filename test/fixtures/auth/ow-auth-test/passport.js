'use strict';

// We copy this into koe/ow-auth/ow-auth-test/passport.js for unit testing purposes and then delete it again. Because
// testing rocks

var sinon = require('sinon');

var ret;

function loadTestAuth() {
  // We need to always return the exact same instance
  return ret;
}

var mainExport = sinon.spy(loadTestAuth);
mainExport.setInnerReturn = function (innerRet) {
  ret = innerRet;
};

module.exports = mainExport;