'use strict';

var express = require('express');
var router = express.Router();
var database = koe.utils.requireRoot('db');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var Promise = require('bluebird');

router.use(bodyParser.json()); 


// Gets entire user INBOX
router.get('/inbox/:userId/:sequenceId', function (req, res, next) {
  koe.logger.info('API request to ', req.originalUrl, req.user.username);

  return database.connect().then(function (db) {
    return db.collection('inbox')
          .find({to: req.user.username})
          .sort({ "sent": -1})
          .toArray();
  }).then(function (messagesInInbox) {
    res.send(messagesInInbox);
  }).catch(next);
});

// Gets entire user's SENT INBOX
router.get('/sentInbox/:userId/:sequenceId', function (req, res) {
  koe.logger.info('API request to ', req.originalUrl, req.user.username);

  return database.connect().then(function (db) {
    return db.collection('sentInbox')
          .find({from: req.user.username})
          .sort({ "sent": -1})
          .toArray();
  }).then(function (messagesInInbox) {
    res.send(messagesInInbox);
  });
});

// Send a message
router.post('/inbox/:userId/:sequenceId', function(req, res) {
  koe.logger.info('API request to ', req.originalUrl, req.user.username);
  var bodyInfo = req.body;
  bodyInfo.sent = new Date(bodyInfo.sent);

  return database.connect().then(function (db) {
    var insertIntoInbox = db.collection('inbox').insert(bodyInfo);
    var insertIntoSentInbox = db.collection('sentInbox').insert(bodyInfo);
    var incrementSentMessagesForUser = db.collection('users').findAndModify(
                { username: req.user.username },
                [['_id','asc']],
                {"$inc":{"nSent":1}},
                {}
              );
    var incrementTotalMessages = db.collection('users').findAndModify(
                { username: bodyInfo.to},
                [['_id','asc']],
                {"$inc":{"nInbox":1}},
                {}
              );

    var queries = [insertIntoInbox, insertIntoSentInbox, incrementSentMessagesForUser, incrementTotalMessages];
    Promise.all(queries).then(function() {
      res.status(200).end();
    });
  });
});

// After message is read, update UnRead message
router.put('/inbox/:userId/:sequenceId', function(req, res) {
  koe.logger.info('API request to ', req.originalUrl, req.user.username);
  var bodyInfo = req.body;

  return database.connect().then(function (db) {
    return db.collection('inbox')
      .update({"_id": mongodb.ObjectId(bodyInfo._id)},{$set:{'unread':0}})
      .then(function(){
        res.status(200).end();
      });
  });
});


// Remove inbox messages 
router.delete('/inbox/:userId/:sequenceId', function(req, res) {
  koe.logger.info('API request to ', req.originalUrl, req.user.username);
  var bodyInfo = req.body;
  
  var ids = bodyInfo.map(function(a) {return mongodb.ObjectId(a._id);});
  
  return database.connect().then(function (db) {
    return db.collection('inbox')
            .remove({'_id':{'$in':ids}})
            .then(function(){
              res.status(200).end();
            });

  });
});

// Remove sent messages 
router.delete('/sentInbox/:userId/:sequenceId', function(req, res) {
  koe.logger.info('API request to ', req.originalUrl, req.user.username);
  var bodyInfo = req.body;
  
  var ids = bodyInfo.map(function(a) {return mongodb.ObjectId(a._id);});
  
  return database.connect().then(function (db) {
    return db.collection('sentInbox')
            .remove({'_id':{'$in':ids}})
            .then(function(){
              res.status(200).end();
            });

  });
});


module.exports = router;

