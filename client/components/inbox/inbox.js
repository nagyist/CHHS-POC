define(['knockout', 'jquery', 'lodash','currentuser'], function (ko, $, _, currentuser) {
  'use strict';

  return function() {
    var userProfile = ko.observable();
    var caseWorkerInfo = ko.observable();
    var inboxData = ko.observableArray();
    var sentData = ko.observableArray();
    var emailToSendChoices = ko.observableArray();
    var nNewMessages = ko.observable(); 
    var id = currentuser._id;
    var emailToSend = ko.observable();
    var subjectToSend = ko.observable('');
    var messageToSend = ko.observable('');
    var selectedMessages = ko.observableArray();
    var selectedSentMessages = ko.observableArray();

    // Get user's profile from mongodb
    function getUserProfile() {
      $.get('/api/userProfileInfo/getUserProfile').then(function(data){
        userProfile(data[0]);
        caseWorkerInfo(userProfile().caseworker);

        // Add emails to compose new message "To" option
        emailToSendChoices.push(caseWorkerInfo().email);
      });
    }

    // Get user's inbox from mongodb
    function getUserInbox(sequence) {
      $.get('/api/userInbox/inbox/' + id + '/' + sequence).then(function(data){
        // assign data to inboxData
        inboxData(data);
        $.each(inboxData(),function( index, message){message.sent = new Date(message.sent);});

        // calculate number of unread messages
        nNewMessages(_.sumBy(inboxData(),'unread'));

        // reset select messages to none
        selectedMessages([]);
        selectedSentMessages([]);
      });
    }

    // Get user's inbox from mongodb
    function getUserSentInbox(sequence) {
      $.get('/api/userInbox/sentInbox/' + id + '/' + sequence).then(function(data){
        // assign data to sent data
        sentData(data);
        $.each(sentData(),function(index, message){message.sent = new Date(message.sent);});

        // reset selected messaged to none
        selectedMessages([]);
        selectedSentMessages([]);
      });
    }

    // define
    getUserProfile(); // Gets user's profile when the page is first loaded
    getUserInbox(0);  // Get messages in first sequence 
    getUserSentInbox(0);  // Get sent messages in first sequence 
    $('#inboxDisplay').show(); // show inbox
    selectedMessages([]); // reset selected messaged to none
    selectedSentMessages([]); // reset selected messaged to none

    // send an email
    function sendMessage(){
      // define message object to send
      var data = {
        to : emailToSend(),
        sequence : 0,
        from : currentuser.username,
        sent :  (new Date()).toUTCString(),
        subject : subjectToSend(),
        message : messageToSend(),
        unread: 1
      };

      $.ajax({
        url:  "/api/userInbox/inbox/" + id + "/0",
        type: "POST",
        contentType: "application/json",
        data: ko.toJSON(data)
      }).fail(function(req, status, err){
        console.log(err);
      });

      // Close modal and reset values
      $('#compose').modal('hide');
      emailToSend();
      subjectToSend('');
      messageToSend('');

      // refresh  inbox
      getUserSentInbox(0);  
      getUserInbox(0); 
    }

    // this opens the compose new message modal
    function openComposeModal() {
      $('#compose').modal('show');
    }

    // this trashes all the checked Inbox messages
    function trashButton(){
      // delete message
      $.ajax({
        url:  "/api/userInbox/inbox/" + id + "/0",
        type: "DELETE",
        contentType: "application/json",
        data: ko.toJSON(selectedMessages())
      }).fail(function(req, status, err){
        console.log(err);
      });

      //refresh inbox
      getUserInbox(0);  // Get messages in first sequence 
      selectedMessages([]);
    }

    // this trashes all the checked Sent messages
    function trashSentButton(){
      $.ajax({
        url:  "/api/userInbox/sentInbox/" + id + "/0",
        type: "DELETE",
        contentType: "application/json",
        data: ko.toJSON(selectedSentMessages())
      }).fail(function(req, status, err){
        console.log(err);
      });
    
      // refresh sent inbox
      getUserSentInbox(0);
      selectedSentMessages([]);
    }

    // sets up values for viewing inboxes and messages
    var isViewingInbox = ko.observable(true);
    var isViewingSentMessages = ko.observable(false);
    var isReadingMessage = ko.observable(false);
    var isReadingSentMessage = ko.observable(false);

    // displays inbox
    function inboxButton (){ 
      isViewingInbox(true); 
      isViewingSentMessages(false); 
      isReadingMessage(false); 
    }
    // displays sent inbox
    function sentInboxButton(){
      getUserSentInbox(); 
      isViewingInbox(false); 
      isViewingSentMessages(true); 
      isReadingSentMessage(false); 
    }

    // refreshes inbox
    // if user reads a message, and presses "Go Back" button, inbox is refreshed
    ko.computed(function(){
      if (isViewingInbox() === true){
        getUserInbox(); 
      }
    });

    return {
      openComposeModal: openComposeModal,
      inboxData: inboxData,
      getUserInbox: getUserInbox,
      sentData: sentData,
      getUserSentInbox: getUserSentInbox,
      emailToSendChoices: emailToSendChoices,
      messageToSend: messageToSend,
      emailToSend: emailToSend,
      subjectToSend: subjectToSend,
      sendMessage: sendMessage,
      nNewMessages: nNewMessages,
      trashButton: trashButton,
      selectedMessages: selectedMessages,
      selectedSentMessages: selectedSentMessages,
      trashSentButton: trashSentButton,
      isViewingInbox: isViewingInbox,
      isViewingSentMessages: isViewingSentMessages,
      isReadingMessage: isReadingMessage,
      isReadingSentMessage: isReadingSentMessage,
      inboxButton: inboxButton,
      sentInboxButton: sentInboxButton
    };
  };
});