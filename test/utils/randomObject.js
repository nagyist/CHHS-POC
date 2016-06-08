'use strict';

var uuid = require('node-uuid');
var chai = require('chai');
var expect = chai.expect;

function setProperty(keyParts, target, value) {
  var nextPart = keyParts.shift();
  if (!keyParts.length) {
    target[nextPart] = value;
    return target[nextPart];
  }

  target[nextPart] = target[nextPart] || {};

  return setProperty(keyParts, target[nextPart], value);
}

function getProperty(keyParts, target) {
  var nextPart = keyParts.shift();
  if (!keyParts.length) {
    return target[nextPart];
  }

  return target[nextPart] ? getProperty(keyParts, target[nextPart]) : undefined;
}

var randomObjectInstances = {};

function objectInstance(instance) {
  var wrapper = {
    set: function (keyPath, value) {
      var keyParts = keyPath.split(/\./);
      var val = typeof value === 'undefined' ? uuid.v4() : value;
      setProperty(keyParts, instance, val);
      return val;
    },
    setInteger: function (keyPath) {
      var val = ~~(Math.random() * 100000);
      return wrapper.set(keyPath, val);
    },
    setExact: function(propertyString, value) {
      var val = typeof value === 'undefined' ? uuid.v4() : value;
      setProperty([propertyString], instance, val);
      return val;
    },
    get: function (keyPath) {
      var keyParts = keyPath.split(/\./);
      return getProperty(keyParts, instance);
    },
    getExact: function (propertyString) {
      return getProperty([propertyString], instance);
    },
    getObject: function () {
      return instance;
    },
    verify: function (keyPath, value) {
      var keyParts = keyPath.split(/\./);
      expect(value).to.equal(getProperty(keyParts, instance));
    }
  };

  return wrapper;
}

module.exports.instance = function getInstance(instanceName) {
  var name = instanceName || 'default';
  var instance = randomObjectInstances[name] = randomObjectInstances[name] || {};

  return objectInstance(instance);
};

module.exports.newInstance = function newInstance(instanceName) {
  var name = instanceName || 'default';
  var instance = randomObjectInstances[name] = {};

  return objectInstance(instance);
};
