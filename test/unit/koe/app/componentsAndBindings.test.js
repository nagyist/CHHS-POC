'use strict';

var path = require('path');
var Promise = require("bluebird");
var fs = Promise.promisifyAll(require("fs"));
var chai = require('chai');

var randomObject = require('../../../utils/randomObject');

var config;
var expect = chai.expect;

var componentsAndBindings = require('../../../../koe/app/componentsAndBindings');
var fixturesDir = path.resolve(__dirname, '../../../fixtures/componentsAndBindings');
var newComponentDir = path.join(fixturesDir, 'components', 'testComponent2');
var newComponentFile = path.join(newComponentDir, 'testComponent2.html');
var newBindingFile = path.join(path.join(fixturesDir, 'bindings'), 'testBinding2.js');

function mkdir(dir) {
  if (fs.existsSync(dir)) {
    return Promise.resolve(dir);
  }

  return fs.mkdirAsync(dir);
}

function createExtraComponents() {
  return mkdir(path.join(newComponentDir)).then(function () {
    return fs.openAsync(newComponentFile, 'a+');
  });
}

function validateComponent(comp, hasViewModel) {
  expect(comp).to.include.keys('name', 'template');
  expect(comp.template).to.equal('components/' + comp.name + '/' + comp.name + '.html');
  if (hasViewModel) {
    expect(comp).to.include.key('viewModel');
    expect(comp.viewModel).to.equal('components/' + comp.name + '/' + comp.name);
  }

}

describe('the components and bindings module', function () {

  var cAndB;
  
  before(function () {
    config = randomObject.newInstance();
    config.set('static.baseDir', fixturesDir);
    config.set('static.componentsDir', path.join(fixturesDir, 'components'));
    config.set('static.bindingsDir', path.join(fixturesDir, 'bindings'));
    cAndB = componentsAndBindings(config.getObject());
  });
  
  it('scans for components', function () {
    expect(cAndB).to.have.property('findComponents').which.is.a('function');

    var components = cAndB.findComponents();
    expect(components).to.be.an('array').and.to.have.lengthOf(1);
    validateComponent(components[0], true);
  });

  it('scans for bindings', function () {
    expect(cAndB).to.have.property('findBindings').which.is.a('function');

    var bindings = cAndB.findBindings();
    expect(bindings).to.be.an('array').and.to.have.lengthOf(1);
    expect(bindings[0]).to.equal('bindings/testBinding.js');
  });
  
  it('rescans components on demand', function () {
    var components = cAndB.findComponents();
    expect(components).to.be.an('array').and.to.have.lengthOf(1);
    
    var newComponents;
    
    return createExtraComponents().then(function () {
      newComponents = cAndB.findComponents(true);
      return fs.unlinkAsync(newComponentFile);
    }).then(function () {
      expect(newComponents).to.be.an('array').and.to.have.lengthOf(2);

      if (path.sep !== '\\') {
        // The unlink operation doesn't complete in time on windows
        expect(cAndB.findComponents(true)).to.be.an('array').and.to.have.lengthOf(1);
      }
    });
  });

  it('rescans bindings on demand', function () {
    var bindings = cAndB.findBindings();
    expect(bindings).to.be.an('array').and.to.have.lengthOf(1);

    var newBindings;

    return fs.openAsync(newBindingFile, 'a+').then(function () {
      newBindings = cAndB.findBindings(true);
      return fs.unlinkAsync(newBindingFile);
    }).then(function () {
      expect(newBindings).to.be.an('array').and.to.have.lengthOf(2);

      if (path.sep !== '\\') {
        // The unlink operation doesn't complete in time on windows
        expect(cAndB.findBindings(true)).to.be.an('array').and.to.have.lengthOf(1);
      }
    });
  });

  it('initializes with a reference to all identified files', function () {
    expect(cAndB.allFiles).to.be.an('array').and.to.have.lengthOf(3);
    expect(cAndB.allFiles).to.include.members([
      'components/testComponent1/testComponent1',
      'text!components/testComponent1/testComponent1.html',
      'bindings/testBinding.js'
    ]);
  });
});
