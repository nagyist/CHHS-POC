'use strict';

var _ = require('lodash');

// Utility function to flatten a nested object, e.g.:
// {
//   foo: {
//     bar: 'baz',
//     bif: 'boo'
//   }
// }
// becomes:
// [{ key: 'foo.bar', value: 'baz' }, { key: 'foo.bif', value: 'boo' }]
function flattenObject(object, prefix) {
  return _(object).map(function (value, key) {
    var objectKey = prefix ? prefix + '.' + key : key;
    if (_.isPlainObject(value)) {
      return flattenObject(value, objectKey);
    }

    return {
      key: objectKey,
      value: value
    };
  }).flatten().value();
}

module.exports = flattenObject;
