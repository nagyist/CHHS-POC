'use strict';

var sinon = require('sinon');

var ret = {
  initialize: sinon.spy(function () {
    return [{ yes: 'yes', no: 'no' }];
  })
};

module.exports = function () {
  return ret;
};
