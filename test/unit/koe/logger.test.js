'use strict';

var chai = require('chai');
var rewire = require('rewire');
var winston = require('winston');
var sinon = require('sinon');
var nonStrictEquality = require('../../utils/nonStrictEquality');
chai.use(nonStrictEquality);

var logger = rewire('../../../koe/logger');

var expect = chai.expect;

var noopTransport = {
  name: 'noop',
  log: function () {},
  on: function () {},
  removeListener: function () {}
};

var oopTransport = {
  name: 'oop',
  log: function () { return 'oop'; },
  on: function () { return 'oop'; },
  removeListener: function () { return 'oop'; }
};

var noopLogger = {
  transport: function noop () { return noopTransport; },
  options: { whatever: 'who cares' }
};

var oopLogger = {
  transport: function oop () { return oopTransport; },
  options: { something: 'meh' }
};

describe('the koe logger module', function () {
  var addSpy, removeSpy, infoSpy;

  beforeEach(function () {
    addSpy = sinon.spy(winston, 'add');
    removeSpy = sinon.spy(winston, 'remove');
    infoSpy = sinon.spy(winston, 'info');
    logger.__set__('winston', winston);
  });

  afterEach(function () {
    winston.add.restore();
    winston.remove.restore();
    winston.info.restore();
  });

  it('should replace the console transport', function () {
    logger({ isTest: true });

    expect(removeSpy.calledOnce).to.be.true;
    expect(removeSpy.calledWithExactly(winston.transports.Console)).to.be.true;

    expect(addSpy.calledOnce).to.be.true;
    expect(addSpy.args[0][0]).to.equal(winston.transports.Console);
  });

  it('should colorize the console output', function () {
    logger({ isTest: true });

    expect(addSpy.calledOnce).to.be.true;
    expect(addSpy.args[0][0]).to.equal(winston.transports.Console);
    expect(addSpy.args[0][1]).to.contain.key('colorize');
    expect(addSpy.args[0][1].colorize).to.be.true;
  });

  it('should add a timestamp to the console output', function () {
    logger({ isTest: true });

    expect(addSpy.calledOnce).to.be.true;
    expect(addSpy.args[0][0]).to.equal(winston.transports.Console);
    expect(addSpy.args[0][1]).to.contain.key('timestamp');
    expect(addSpy.args[0][1].timestamp).to.be.a('function');
    expect(addSpy.args[0][1].timestamp()).to.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  });

  it('should add additional configured loggers', function () {
    logger({ isTest: true, logging: [noopLogger, oopLogger] });

    expect(addSpy.calledThrice).to.be.true;

    expect(addSpy.args[1][0]()).to.equal(noopTransport);
    expect(addSpy.args[1][1]).to.equal(noopLogger.options);

    expect(addSpy.args[2][0]()).to.equal(oopTransport);
    expect(addSpy.args[2][1]).to.equal(oopLogger.options);

    // Cleanup
    winston.remove('noop');
    winston.remove('oop');
  });

  it('should log the fact that additional loggers have been added', function () {
    logger({ isTest: true, logging: [noopLogger, oopLogger] });

    expect(infoSpy.calledTwice).to.be.true;

    expect(infoSpy.args[0][0]).to.equal('Adding logger:');
    expect(infoSpy.args[0][1]).to.be.nonStrictEqual({ transportFunctionName: 'noop', options: noopLogger.options });

    expect(infoSpy.args[1][0]).to.equal('Adding logger:');
    expect(infoSpy.args[1][1]).to.be.nonStrictEqual({ transportFunctionName: 'oop', options: oopLogger.options });

    // Cleanup
    winston.remove('noop');
    winston.remove('oop');
  });
});