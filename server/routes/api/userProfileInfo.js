'use strict';

var express = require('express');
var router = express.Router();
var database = koe.utils.requireRoot('db');
var bodyParser = require('body-parser');

router.use(bodyParser.json()); 

// Gets entire user profile, including family and child information
router.get('/getUserProfile', function (req, res) {
  // req.user contains the currently-logged-in user, so we can filter on that in our db queries
  koe.logger.info('API request to ', req.originalUrl, req.user.username);

  return database.connect().then(function (db) {
    return db.collection('usersFamilyChildrenCaseworker')
          .find({ username: req.user.username })
          .toArray();
  }).then(function (usersInfo) {
    res.send(usersInfo);
  });
});

var sendResponseIfNoError = function(response) {
  return function(err) {
    if (err) {
      // console.log(err);
    } else {
      response.status(200).end();
    }
  };
};

// Update a User's information
router.put('/users/:userId/userInfo', function(req, res) {
  koe.logger.info('API request to ', req.originalUrl, req.user.username);
  var bodyInfo = req.body;

  return database.connect().then(function (db) {
    return db.collection('usersFamilyChildrenCaseworker')
            .findAndModify(
              { username: req.user.username },
              [['_id','asc']],
              {$set: {"userinfo":bodyInfo}},
              {},
              sendResponseIfNoError(res)
            );
  });
});

// Update a child's information
router.put('/users/:userId/children/:childIndex', function(req, res) {
  koe.logger.info('API request to ', req.originalUrl, req.user.username);
  var childIndex = req.params.childIndex;
  var bodyInfo = req.body;
  var childInfo = {};

  childInfo['children.'+ childIndex +'.firstname'] = bodyInfo.firstname;
  childInfo['children.'+ childIndex +'.lastname'] = bodyInfo.lastname;
  childInfo['children.'+ childIndex +'.birthday'] = bodyInfo.birthday;
  childInfo['children.'+ childIndex +'.phone'] = bodyInfo.phone;
  childInfo['children.'+ childIndex +'.family'] = bodyInfo.family;
  childInfo['children.'+ childIndex +'.notes'] = bodyInfo.notes;

  return database.connect().then(function (db) {
    return db.collection('usersFamilyChildrenCaseworker')
            .findAndModify(
              { username: req.user.username },
              [['_id','asc']],
              {$set: childInfo},
              {},
              sendResponseIfNoError(res)
            );
  });
});

// Remove a child's information
router.delete('/users/:userId/children/:childIndex', function(req, res) {
  koe.logger.info('API request to ', req.originalUrl, req.user.username);
  var bodyInfo = req.body;
  
  return database.connect().then(function (db) {
    return db.collection('usersFamilyChildrenCaseworker')
            .findAndModify(
              { username: req.user.username },
              [['_id','asc']],
              {$pull: {"children":bodyInfo}},
              {},
              sendResponseIfNoError(res)
            );
  });
});

// Add a child's information
router.post('/users/:userId/children/:childIndex', function(req, res) {
  koe.logger.info('API request to ', req.originalUrl, req.user.username);
  var bodyInfo = req.body;

  return database.connect().then(function (db) {
    return db.collection('usersFamilyChildrenCaseworker')
            .findAndModify(
              { username: req.user.username},
              [['_id','asc']],
              {$push: {"children": bodyInfo}},
              {},
              sendResponseIfNoError(res)
            );
  });

});

// Update a family information
router.put('/users/:userId/family/:familyIndex', function(req, res) {
  koe.logger.info('API request to ', req.originalUrl, req.user.username);
  var familyIndex = req.params.familyIndex;
  var bodyInfo = req.body;
  var familyInfo = {};

  familyInfo['family.'+ familyIndex +'.firstname'] = bodyInfo.firstname;
  familyInfo['family.'+ familyIndex +'.lastname'] = bodyInfo.lastname;
  familyInfo['family.'+ familyIndex +'.relationToUser'] = bodyInfo.relationToUser;
  familyInfo['family.'+ familyIndex +'.phone'] = bodyInfo.phone;
  familyInfo['family.'+ familyIndex +'.email'] = bodyInfo.email;

  return database.connect().then(function (db) {
    return db.collection('usersFamilyChildrenCaseworker')
            .findAndModify(
              { username: req.user.username },
              [['_id','asc']],
              {$set: familyInfo},
              {},
              sendResponseIfNoError(res)
            );
  });
});


// Remove a family's information
router.delete('/users/:userId/family/:familyIndex', function(req, res) {
  koe.logger.info('API request to ', req.originalUrl, req.user.username);
  var bodyInfo = req.body;
  
  return database.connect().then(function (db) {
    return db.collection('usersFamilyChildrenCaseworker')
            .findAndModify(
              { username: req.user.username },
              [['_id','asc']],
              {$pull: {"family":bodyInfo}},
              {},
              sendResponseIfNoError(res)
            );
  });
});

module.exports = router;