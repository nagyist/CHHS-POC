'use strict';

var mongodb = require('mongodb');
var Promise = require('bluebird');
var koe = require('./koe');

var _db;

module.exports.connect = Promise.method(function () {
  if (_db) {
    return Promise.resolve(_db);
  }

  return mongodb.connect(koe.config.mongodbUri, { promiseLibrary: Promise }).then(function (db) {
    _db = db;
    return Promise.resolve(_db);
  });
});

module.exports.close = Promise.method(function () {
  if (_db) {
    return _db.close().then(function () {
      _db = undefined;
    });
  }
  return Promise.resolve();
});