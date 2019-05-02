var $ = require("jquery");
function updatePerson(id){
    console.log("I am in update Person function.");
    $.ajax({
        url: '/profile/edit/' + id,
        type: 'PUT',
        data: $('#update-person').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};