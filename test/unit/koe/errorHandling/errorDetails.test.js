'use strict';

var chai = require('chai');

var expect = chai.expect;

var errorDetails = require('../../../../koe/errorHandling/errorDetails');

describe('the errorDetails module', function () {

  it('should extract the appropriate properties from the error when it is an object and return formatted JSON', function () {
    var details = errorDetails({ name: 'foo', message: 'bar', stack: 'baz', ignored: 'biff'});
    expect(details).to.equal('{\n    "name": "foo",\n    "message": "bar",\n    "stack": "baz"\n}');
  });

  it('should call toString() on the error when it is not an object and return formatted JSON', function () {
    var details = errorDetails('test');
    expect(details).to.equal('{\n    "message": "test"\n}');
  });
});