define(['knockout', 'jquery', 'currentuser'], function (ko, $, currentuser) {
  'use strict';

  return function(params) {
    var messageToRead = ko.observable();
    var id = currentuser._id;
    
    // this displays a message and updates the document to be "read"
    var openMessage = function(message){
      messageToRead(message);
      
      params.isViewingInbox(false);
      params.isReadingMessage(true);

      // update message to "read"
      $.ajax({
        url:  "/api/userInbox/inbox/" + id + "/0",
        type: "PUT",
        contentType: "application/json",
        data: ko.toJSON(message)
      })
        .done(function(){
          // console.log('updated unread field');
        })
        .fail(function(req, status, err){
          console.log(err);
        })
        .always(function(){
          // console.log('completed openMessage');
        });
    };


    return {
      openMessage: openMessage,
      messageToRead: messageToRead,
      isViewingInbox: params.isViewingInbox,
      isReadingMessage: params.isReadingMessage
    };
  };
});