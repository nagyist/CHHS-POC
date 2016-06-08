
define(['knockout','jquery','currentuser'], function (ko, $, currentuser) {

  var EditUserModal = function EditUserModal(params) {
    var userZipcodeBeingEdited = ko.observable();
    var userPhoneBeingEdited = ko.observable();

    function setUserProperties(theUser) {
      if (!theUser) {
        return;
      }
      userZipcodeBeingEdited(theUser.zipcode);
      userPhoneBeingEdited(theUser.phone);
    }

    // save user's information
    function saveUserInfo(){
      var data = {
        "phone" : userPhoneBeingEdited(),
        "zipcode" : userZipcodeBeingEdited(),
      };
      var id = currentuser._id;
      $.ajax({
        url:  "/api/userProfileInfo/users/" + id + "/userInfo/",
        type: "PUT",
        contentType: "application/json",
        data: ko.toJSON(data)
      })
        .done(function(){
          $('#userModal').modal('hide');
        })
        .fail(function(req, status, err){
          console.log(err);
        });
    }

    params.user.subscribe(setUserProperties);

    return {
      userZipcodeBeingEdited: userZipcodeBeingEdited,
      userPhoneBeingEdited: userPhoneBeingEdited,
      saveUserInfo: saveUserInfo
    };
  };
  
  return EditUserModal;
});
