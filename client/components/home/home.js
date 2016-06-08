define(['knockout', 'jquery', 'lodash','currentuser', 'pager'], function (ko, $, _, currentuser, pager) {
  'use strict';

  return function () {
    var childInfo = ko.observableArray();
    var userProfile = ko.observable();
    var userInfo = ko.observable();
    var inboxData = ko.observableArray();
    var nNewMessages = ko.observable(); 
    var id = currentuser._id;

    function getUserProfile() {
      $.get('/api/userProfileInfo/getUserProfile').then(function(data){
        userProfile(data[0]);
        userInfo(userProfile().userinfo);
        childInfo(userProfile().children);
      });
    }
    // Get user's inbox from mongodb
    function getUserInbox(sequence) {
      $.get('/api/userInbox/inbox/' + id + '/' + sequence).then(function(data){
        inboxData(data);
        nNewMessages(_.sumBy(inboxData(),'unread'));
      });
    }

    function goToInbox(){
      pager.navigate("#!/inbox");
    }

    getUserProfile();
    getUserInbox(0);

    return {
      childInfo: childInfo,
      currentuser: currentuser,
      userInfo: userInfo,
      inboxData: inboxData,
      nNewMessages: nNewMessages,
      goToInbox: goToInbox
    };
  };
});
