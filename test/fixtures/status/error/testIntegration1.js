'use strict';

module.exports.description = 'this test will throw an error';

module.exports.test = function () {
  throw new Error('TEST');
};
