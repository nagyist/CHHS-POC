'use strict';

module.exports.name = 'timeout test 1';
module.exports.description = 'this test will timeout after 1ms';

module.exports.test = function (done) {
  setTimeout(done, 2000);
};

module.exports.timeout = 1;