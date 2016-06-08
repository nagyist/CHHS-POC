// All rules explained here: http://eslint.org/docs/rules/
module.exports = {
  rules: {
    'no-console': 0, // Allow console.* on browsers
  },
  env: {
    browser: true,
    amd: true,
    node: false, // Disable node env for browsers.  NOTE: This doesn't work yet, will be fixed in future eslint version.
  }
};
