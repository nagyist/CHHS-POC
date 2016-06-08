'use strict';

var chai = require('chai');
var sinon = require('sinon');
var rewire = require('rewire');
var path = require('path');

var expect = chai.expect;
var nonStrictEquality = require('../../../utils/nonStrictEquality');
chai.use(nonStrictEquality);

var autoconfigureRoutes = rewire('../../../../koe/utils/autoconfigureRoutes');
var mockLogger = { info: sinon.spy() };
var mockRouter = { use: sinon.spy() };
var mockExpress = { Router: function () { return mockRouter; } };

var fixturesDir = path.resolve(__dirname, '../../../fixtures/autoconfigureRoutes');

describe('the autoconfigureRoutes utility', function () {
  before( function () {
    autoconfigureRoutes.__set__('express', mockExpress);

    autoconfigureRoutes(fixturesDir, mockLogger);
  });

  it('scans all files and mounts them appropriately', function () {
    expect(mockRouter.use.callCount).to.equal(3);
    expect(mockLogger.info.callCount).to.equal(3);
  });

  it('mounts files called index.js on /', function () {
    expect(mockRouter.use.args[0][0]).to.equal('/');
    expect(mockRouter.use.args[0][1]).to.be.nonStrictEqual({ frank: 'castle' });

    expect(mockLogger.info.args[0][0]).to.equal('Adding routes on /');
  });

  it ('mounts files called [filename].js on /filename', function () {
    expect(mockRouter.use.args[1][0]).to.equal('/testRouteFile');
    expect(mockRouter.use.args[1][1]).to.be.nonStrictEqual({ matt: 'murdock' });

    expect(mockLogger.info.args[1][0]).to.equal('Adding routes on /testRouteFile');
  });

  it('mounts files in subdirectories relative to the name of that subdirectory', function () {
    expect(mockRouter.use.args[2][0]).to.equal('/zzzz');
    expect(mockRouter.use.args[2][1]).to.be.nonStrictEqual({ foggy: 'nelson' });

    expect(mockLogger.info.args[2][0]).to.equal('Adding routes on /zzzz');
  });
});
