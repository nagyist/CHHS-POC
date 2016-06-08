'use strict';

module.exports = {
  rules: {
    'no-unused-expressions': 0
  },
  globals: {
    before: false, // "logger" is our global winston instance.  "false" means code can't overwrite it.
    after: false,
    beforeEach: false,
    afterEach: false,
    describe: false,
    it: false
  }
};
