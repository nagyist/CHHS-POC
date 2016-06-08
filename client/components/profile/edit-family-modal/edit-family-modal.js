define(['knockout','jquery','currentuser'], function (ko, $, currentuser) {

  var EditFamilyModal = function EditFamilyModal(params) {
    var familyFirstNameBeingEdited = ko.observable();
    var familyLastNameBeingEdited = ko.observable();
    var relationshipToUserBeingEdited = ko.observable();
    var familyEmailNameBeingEdited = ko.observable();
    var familyPhoneNameBeingEdited = ko.observable();
    var familyIndex = ko.observable();

    function setFamilyProperties(theFamily) {
      if (!theFamily) {
        return;
      }
      familyFirstNameBeingEdited(theFamily.firstname);
      familyLastNameBeingEdited(theFamily.lastname);
      relationshipToUserBeingEdited(theFamily.relationToUser);
      familyPhoneNameBeingEdited(theFamily.phone);
      familyEmailNameBeingEdited(theFamily.email);
    }

    function setIndex(theIndex){
      familyIndex(theIndex);
    }

    // save family info
    function saveFamilyInfo(){
      var data = {
        "firstname" : familyFirstNameBeingEdited(),
        "lastname" : familyLastNameBeingEdited(),
        "relationToUser" : relationshipToUserBeingEdited(),
        "phone" : familyPhoneNameBeingEdited(),
        "email" : familyEmailNameBeingEdited(),
      };
      var id = currentuser._id;
      $.ajax({
        url:  "/api/userProfileInfo/users/" + id + "/family/" + familyIndex(),
        type: "PUT",
        contentType: "application/json",
        data: ko.toJSON(data)
      })
        .done(function(){
          $('#familyModal').modal('hide');
        })
        .fail(function(req, status, err){
          console.log(err);
        });
    }

    params.family.subscribe(setFamilyProperties);
    params.familyToEditIndex.subscribe(setIndex);

    return {
      familyFirstNameBeingEdited: familyFirstNameBeingEdited,
      familyLastNameBeingEdited: familyLastNameBeingEdited,
      relationshipToUserBeingEdited: relationshipToUserBeingEdited,
      familyEmailNameBeingEdited: familyEmailNameBeingEdited,
      familyPhoneNameBeingEdited: familyPhoneNameBeingEdited,
      saveFamilyInfo: saveFamilyInfo
    };
  };
  
  return EditFamilyModal;
});