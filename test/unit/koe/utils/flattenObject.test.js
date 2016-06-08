'use strict';

var chai = require('chai');
var expect = chai.expect;
var nonStrictEquality = require('../../../utils/nonStrictEquality');
chai.use(nonStrictEquality);

var flattenObject = require('../../../../koe/utils/flattenObject');

describe('the flattenObject utility', function () {
  it('flattens an object', function () {
    var obj = {
      test: 'that',
      something: {
        recursive: [
          'still',
          'works'
        ]
      }
    };

    var result = flattenObject(obj);
    expect(result.length).to.equal(2);

    expect(result[0]).to.be.nonStrictEqual({ key: 'test', value: 'that' });
    expect(result[1]).to.be.nonStrictEqual({ key: 'something.recursive', value: ['still', 'works']});
  });
});