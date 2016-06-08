/*eslint-disable no-invalid-this */

'use strict';

var _ = require('lodash');

function isEqual(first, second) {
  if (_.isArray(first) || _.isPlainObject(first)) {
    return _.every(first, function (item, ix) {
      return isEqual(item, second[ix]);
    });
  }
  return first === second;
}

function compareObjects(obj1, obj2) {
  return _(obj1).map(function (v, k) {
    return obj2 && obj2.hasOwnProperty(k) && isEqual(v, obj2[k]);
  }).every();
}

module.exports = function (chai, utils) {
  var Assertion = chai.Assertion,
    flag = utils.flag;

  function assertNonStrictEqual (val, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');

    // Check equality in both directions
    var result1 = compareObjects(val, obj);
    var result2 = compareObjects(obj, val);

    this.assert(
      result1 && result2
      , 'expected #{this} to equal #{exp}'
      , 'expected #{this} to not equal #{exp}'
      , val
      , this._obj
      , true
    );
  }

  Assertion.addMethod('nonStrictEqual', assertNonStrictEqual);

  function assertIsSuperObject(val, msg) {
    if (msg) flag(this, 'message', msg);
    var obj = flag(this, 'object');

    // Check equality in one direction only
    var result = compareObjects(val, obj);

    this.assert(
      result
      , 'expected #{this} to be a superobject of #{exp}'
      , 'expected #{this} to not be a superobject of #{exp}'
      , val
      , this._obj
      , true
    );
  }

  Assertion.addMethod('superObjectOf', assertIsSuperObject);
};
