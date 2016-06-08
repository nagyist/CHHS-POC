define(['knockout', 'jquery', 'currentuser'], function (ko, $, currentuser) {
  'use strict';

  return function () {
    var userProfile = ko.observable();
    var childInfo = ko.observableArray();
    var caseWorkerInfo = ko.observable();
    var userInfo = ko.observableArray();
    var familyInfo = ko.observableArray();
    var childIndex = ko.observable();
    var familyIndex = ko.observable();
    var id = currentuser._id;

    // Get user's profile from mongodb
    function getUserProfile() {
      $.get('/api/userProfileInfo/getUserProfile').then(function(data){
        userProfile(data[0]);
        childInfo(userProfile().children);
        userInfo(userProfile().userinfo);
        familyInfo(userProfile().family);
        caseWorkerInfo(userProfile().caseworker);
      });
    }

    // This gets user's profile when the page is first loaded
    getUserProfile();
      
    var userToEdit = ko.observable();
    function openUserModal() {
      userToEdit(userInfo());
      $('#userModal').modal('show');
      $('#userModal').on('hidden.bs.modal',getUserProfile);
    }
    
    var childToEdit = ko.observable();
    // When add child button is clicked, a blank child is posted to mongodb and a modal is opened for editing
    function addChild () {
      // create blank child
      var child = {
        firstname: '',
        lastname: '',
        birthday: '',
        phone: '',
        notes: '',
        family: []
      };

      // post child
      childIndex(childInfo().length);
      openChildModal(child,null);
    }
    
    // delete child
    function removeChild(child, event) {
      childIndex(ko.contextFor(event.target).$index());
      $.ajax({
        url:  "/api/userProfileInfo/users/" + id + "/children/" + childIndex(),
        type: "DELETE",
        contentType: "application/json",
        data: ko.toJSON(child)
      })
      .done(function(){
        getUserProfile();
      })
      .fail(function(req, status, err){
        console.log(err);
      });
    }
    
    function openChildModal(child, event) {
      childToEdit(child);
      if (event!=null){
        // This happens when modal triggered from the page, and not when a new child is added
        childIndex(ko.contextFor(event.target).$index());
      }
      $('#childModal').modal('show');
      $('#childModal').on('hidden.bs.modal',getUserProfile);
    }

    var familyToEdit = ko.observable();
    function addFamily() {
      // create blank family
      var family = {
        firstname: '',
        lastname: '',
        relationToUser: '',
        phone: '',
        email: '',
      };

      // post family
      familyIndex(familyInfo().length);
      openFamilyModal(family,null);
    }

    // delete family
    function removeFamily(family, event) {
      familyIndex(ko.contextFor(event.target).$index());
      $.ajax({
        url:  "/api/userProfileInfo/users/" + id + "/family/" + familyIndex(),
        type: "DELETE",
        contentType: "application/json",
        data: ko.toJSON(family)
      })
      .done(function(){
        getUserProfile();
      })
      .fail(function(req, status, err){
        console.log(err);
      });
    }

    function openFamilyModal(family, event) {
      familyToEdit(family);
      if (event!=null){
        // This happens when modal triggered from the page, and not when a new child is added
        familyIndex(ko.contextFor(event.target).$index());
      }
      $('#familyModal').modal('show');
      $('#familyModal').on('hidden.bs.modal',getUserProfile);
    }
    

    return {
      currentuser: currentuser,
      childInfo: childInfo,
      userInfo: userInfo,
      caseWorkerInfo: caseWorkerInfo,
      familyInfo: familyInfo,
      childToEdit: childToEdit,
      childIndex: childIndex,
      familyToEdit: familyToEdit,
      familyIndex: familyIndex,
      userToEdit: userToEdit,
      openChildModal: openChildModal,
      openFamilyModal: openFamilyModal,
      openUserModal: openUserModal,
      addChild: addChild,
      removeChild: removeChild,
      addFamily: addFamily,
      removeFamily: removeFamily
    };
  };
});



