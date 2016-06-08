'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var chai = require('chai');

var randomObject = require('../../../utils/randomObject');
var nonStrictEquality = require('../../../utils/nonStrictEquality');
chai.use(nonStrictEquality);

var config;
var expect = chai.expect;

var status = require('../../../../koe/app/status');

describe('The status module', function () {
  it('should return two functions', function () {
    var stat = status({});
    expect(stat).to.be.an('object');
    expect(stat).to.include.all.keys('getUpDownStatus', 'getFullStatusInfo');
    expect(stat.getUpDownStatus).to.be.a('function');
    expect(stat.getFullStatusInfo).to.be.a('function');
  });

  describe('when no integration directory is configured', function () {
    it('should have an UP status', function () {
      return status({}).getUpDownStatus().then(function (result) {
        return expect(result).to.be.true;
      }).then(function () {
        return status({ status: {} }).getUpDownStatus();
      }).then(function (result) {
        return expect(result).to.be.true;
      });
    });
  });

  describe('when no integration modules are configured', function () {
    before(function () {
      config = randomObject.newInstance();
      var emptyDir = path.resolve(__dirname, '../../../fixtures/status/empty');

      if (!fs.existsSync(emptyDir)){
        fs.mkdirSync(emptyDir);
      }

      config.set('status.integrationsDir', emptyDir);
    });

    it('should have an UP status', function () {
      var stat = status(config.getObject());

      return stat.getUpDownStatus().then(function (result) {
        expect(result).to.be.true;
      });
    });
  });
  
  describe('when all integration modules are disabled', function () {
    before(function () {
      config = randomObject.newInstance();
      var disabledDir = path.resolve(__dirname, '../../../fixtures/status/disabled');
      config.set('status.integrationsDir', disabledDir);
    });

    it('should have an UP status', function () {
      var stat = status(config.getObject());

      return stat.getUpDownStatus().then(function (result) {
        expect(result).to.be.true;
      });
    });

    it('should return the details of the disabled tests', function () {
      var stat = status(config.getObject());

      return stat.getFullStatusInfo().then(function (result) {
        expect(result).to.be.an('array').and.to.have.lengthOf(2);
        expect(_(result).map('status').every(function (s) { return s === 'DISABLED'; })).to.be.true;
        expect(result[0]).to.be.nonStrictEqual({ basename: 'test integration', description: 'is used for testing', status: 'DISABLED' });
        expect(result[1]).to.be.nonStrictEqual({ basename: 'testIntegration2', description: undefined, status: 'DISABLED' });
      });
    });
  });

  describe('when an integration module times out', function () {
    before(function () {
      config = randomObject.newInstance();
      var timeoutDir = path.resolve(__dirname, '../../../fixtures/status/timeout');
      config.set('status.integrationsDir', timeoutDir);
    });

    it('should have a DOWN status', function () {
      var stat = status(config.getObject());

      return stat.getUpDownStatus().then(function (result) {
        expect(result).to.be.false;
      });
    });

    it('should return the details of the failing tests', function () {
      var stat = status(config.getObject());

      return stat.getFullStatusInfo().then(function (result) {
        expect(result).to.be.an('array').and.to.have.lengthOf(1);
        expect(result[0]).to.be.nonStrictEqual({ basename: 'timeout test 1', description: 'this test will timeout after 1ms', status: 'TIMEOUT' });
      });
    });
  });
  
  describe('when an integration module throws an error', function () {
    before(function () {
      config = randomObject.newInstance();
      var errorDir = path.resolve(__dirname, '../../../fixtures/status/error');
      config.set('status.integrationsDir', errorDir);
    });

    it('should have a DOWN status', function () {
      var stat = status(config.getObject());

      return stat.getUpDownStatus().then(function (result) {
        expect(result).to.be.false;
      });
    });

    it('should return the details of the failing tests', function () {
      var stat = status(config.getObject());

      return stat.getFullStatusInfo().then(function (result) {
        expect(result).to.be.an('array').and.to.have.lengthOf(1);
        expect(result[0]).to.be.nonStrictEqual({ basename: 'testIntegration1', description: 'this test will throw an error', status: 'ERROR' });
      });
    });
  });

  describe('when an integration module flags a failing integration', function () {
    before(function () {
      config = randomObject.newInstance();
      var failureDir = path.resolve(__dirname, '../../../fixtures/status/failure');
      config.set('status.integrationsDir', failureDir);
    });

    it('should have a DOWN status', function () {
      var stat = status(config.getObject());

      return stat.getUpDownStatus().then(function (result) {
        expect(result).to.be.false;
      });
    });

    it('should return the details of the failing tests', function () {
      var stat = status(config.getObject());

      return stat.getFullStatusInfo().then(function (result) {
        expect(result).to.be.an('array').and.to.have.lengthOf(1);
        expect(result[0]).to.be.nonStrictEqual({
          basename: 'testIntegration1',
          description: 'this test will return false',
          status: 'FAILURE'
        });
      });
    });
  });
  
  describe('when an integration module succeeds', function () {
    before(function () {
      config = randomObject.newInstance();
      var successDir = path.resolve(__dirname, '../../../fixtures/status/success');
      config.set('status.integrationsDir', successDir);
    });

    it('should have an UP status', function () {
      var stat = status(config.getObject());

      return stat.getUpDownStatus().then(function (result) {
        expect(result).to.be.true;
      });
    });

    it('should return the details of the tests', function () {
      var stat = status(config.getObject());

      return stat.getFullStatusInfo().then(function (result) {
        expect(result).to.be.an('array').and.to.have.lengthOf(1);
        expect(result[0]).to.be.nonStrictEqual({
          basename: 'testIntegration1',
          description: 'this test will return true',
          status: 'SUCCESS'
        });
      });
    });
  });

  describe('when we have a mix of success and failure in all its forms', function () {
    before(function () {
      config = randomObject.newInstance();
      var allFixturesDir = path.resolve(__dirname, '../../../fixtures/status');
      config.set('status.integrationsDir', allFixturesDir);
    });

    it('should have a DOWN status', function () {
      var stat = status(config.getObject());

      return stat.getUpDownStatus().then(function (result) {
        expect(result).to.be.false;
      });
    });

    it('should return the details of all the tests', function () {
      var stat = status(config.getObject());

      return stat.getFullStatusInfo().then(function (result) {
        expect(result).to.be.an('array').and.to.have.lengthOf(6);
        expect(_.map(result, 'status')).to.include.members(['SUCCESS', 'FAILURE', 'TIMEOUT', 'ERROR', 'DISABLED']);
      });
    });
  });
});