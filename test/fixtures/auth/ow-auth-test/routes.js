'use strict';

// We copy this into koe/ow-auth/ow-auth-test/routes.js for unit testing purposes and then delete it again. Because
// testing rocks

var sinon = require('sinon');

module.exports = sinon.spy(function () {
  return { who: 'cares' };
});