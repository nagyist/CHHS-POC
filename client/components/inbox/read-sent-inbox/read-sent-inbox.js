define(['knockout'], function (ko) {
  'use strict';

  return function(params) {
    var messageToRead = ko.observable();

    // this opens a sent message
    function openMessage(message){
      messageToRead(message);

      params.isViewingSentMessages(false);
      params.isReadingSentMessage(true);
    }

    return {
      openMessage: openMessage,
      messageToRead: messageToRead,
      isViewingSentMessages: params.isViewingSentMessages,
      isReadingSentMessage: params.isReadingSentMessage
    };
  };
});