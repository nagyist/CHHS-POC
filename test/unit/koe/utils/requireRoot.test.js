'use strict';

var chai = require('chai');
var expect = chai.expect;
var nonStrictEquality = require('../../../utils/nonStrictEquality');
chai.use(nonStrictEquality);

var requireRoot = require('../../../../koe/utils/requireRoot');
var actualPackageJson = require('../../../../package.json');

describe('the requireRoot utility', function () {
  it('loads up files from the root of the application directory', function () {
    var packageJson = requireRoot('package.json');

    expect(packageJson).to.be.nonStrictEqual(actualPackageJson);
  });

  it('provides a default if the required file is not found and a default is set', function () {
    var dummyObject = { dummy: 'object' };
    var defaultReturn = requireRoot('non-existent-file.json', dummyObject);

    expect(defaultReturn).to.equal(dummyObject);
  });

  it('throws an exception if the required file is not found and no default is set', function () {
    expect(requireRoot.bind(requireRoot, 'non-existent-file.json')).to.throw(Error);
  });
  
  it('allows a new root to be specified', function () {
    requireRoot.setTestMode('../../test/fixtures/requireRoot/test1');
    var packageJson1 = requireRoot('package.json');
    expect(packageJson1.name).to.equal('requireRootTest1');

    requireRoot.setTestMode(true, '../../test/fixtures/requireRoot/test2');
    var packageJson2 = requireRoot('package.json');
    expect(packageJson2.name).to.equal('requireRootTest2');

    requireRoot.setTestMode(false);
    var packageJson = requireRoot('package.json');
    expect(packageJson).to.be.nonStrictEqual(actualPackageJson);
  });
});