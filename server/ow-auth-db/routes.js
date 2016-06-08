'use strict';
var express = require('express');
var path = require('path');
var passportModule = require('./passport');
var router = express.Router();
var db = require('../../db');

module.exports = function (owAuthConfig) {
  var passport = passportModule(owAuthConfig);
  var authenticate = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  });

  // Login page
  router.get('/login', function (req, res) {
    res.render(path.join(__dirname, 'login.hbs'), { info: req.flash('info'), warning: req.flash('warning') });
  });

  router.post('/login', authenticate, function (req, res) {
    // Save user to session vars
    req.session.user = req.user;
    res.redirect(req.body.returnUrl || '/');
  });

  router.get('/register', function (req, res) {
    res.render(path.join(__dirname, 'register.hbs'), { info: req.flash('info'), warning: req.flash('warning') });
  });

  router.post('/register', function (req, res) {
    var user = { firstname: req.body.firstname, 
      lastname: req.body.lastname, 
      username: req.body.username,
      nInbox: 1,
      nSent: 0 };
    var userProfile = {
      username: req.body.username,
      userinfo: { zipcode: req.body.zipcode, phone: "" },
      family: [],
      children: [],
      caseworker: {
        firstname: "Nancy",
        lastname: "Adams",
        phone: "123-456-7806",
        email: "nancy.adams.chhs@caseworker.com"
      }
    };
    var msg={
      to: req.body.username,
      sequence: 0,
      from: "admin@chhs.ca.gov",
      sent:  new Date(), //(new Date ()).toString(),
      subject: "Welcome to CHHS",
      message: "Hi " + req.body.firstname, 
      unread: 1
    };

    return db.connect().then(function (database) {
      return database.collection('users').find({ username: user.username }).toArray().then(function (users) {
        if (users.length) {
          req.flash('warning', 'User already exists');
          return res.redirect('/register');
        }

        return database.collection('users').insert(user).then(function () {
          database.collection('usersFamilyChildrenCaseworker').insert(userProfile);
          database.collection('inbox').insert(msg);
          req.flash('info', 'User created. Please login below.');
          return res.redirect('/login');
        });
      });
    });
  });

  // Logout
  router.use('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/login');
  });

  // Return current user
  router.get('/api/auth/currentUser', function (req, res) {
    res.send(req.session.user);
  });

  return router;
};
