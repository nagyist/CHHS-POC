define(['knockout','jquery','currentuser'], function (ko, $, currentuser) {

  var EditChildModal = function EditChildModal(params) {
    var childFirstNameBeingEdited = ko.observable();
    var childLastNameBeingEdited = ko.observable();
    var childBirthdayBeingEdited = ko.observable();
    var childPhoneBeingEdited = ko.observable();
    var childCareNotes = ko.observable();
    var childFamilyBeingEdited = ko.observableArray();
    var childIndex = ko.observable();

    function setChildProperties(theChild) {
      if (!theChild) {
        return;
      }
      childFirstNameBeingEdited(theChild.firstname);
      childLastNameBeingEdited(theChild.lastname);
      childBirthdayBeingEdited(theChild.birthday);
      childPhoneBeingEdited(theChild.phone);
      childCareNotes(theChild.notes);
      childFamilyBeingEdited(theChild.family);
    }

    function setIndex(theIndex){
      childIndex(theIndex);
    }

    // adds a family member
    function addFamily(){
      childFamilyBeingEdited.push({firstname: ""});
    }

    // removes a family member
    function removeFamily(theFamily){
      childFamilyBeingEdited.remove(theFamily);
    }
    
    // edits child profile
    function saveChildInfo(){
      childFamilyBeingEdited.remove(function (family) { return family.firstname === ''; });
      var data = {
        firstname : childFirstNameBeingEdited(),
        lastname : childLastNameBeingEdited(),
        birthday : childBirthdayBeingEdited(),
        phone : childPhoneBeingEdited(),
        notes : childCareNotes(),
        family : childFamilyBeingEdited
      };
      var id = currentuser._id;
      $.ajax({
        url:  "/api/userProfileInfo/users/" + id + "/children/" + childIndex(),
        type: "PUT",
        contentType: "application/json",
        data: ko.toJSON(data)
      })
        .done(function(){
          $('#childModal').modal('hide');
        })
        .fail(function(req, status, err){
          console.log(err);
        });
    }

    params.child.subscribe(setChildProperties);
    params.childToEditIndex.subscribe(setIndex);

    return {
      childFirstNameBeingEdited: childFirstNameBeingEdited,
      childLastNameBeingEdited: childLastNameBeingEdited,
      childBirthdayBeingEdited: childBirthdayBeingEdited,
      childPhoneBeingEdited: childPhoneBeingEdited,
      childCareNotes: childCareNotes,
      childFamilyBeingEdited: childFamilyBeingEdited,
      saveChildInfo: saveChildInfo,
      addFamily: addFamily,
      removeFamily: removeFamily
    };
  };
  
  return EditChildModal;
});