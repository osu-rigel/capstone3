/*
Function checks for created password. 
New password and re-typed password must match.
*/

function ValidateNewPassword(){
    var NewPassword = document.getElementById("NewPassword").value;
    var RetypePassword = document.getElementById("RepeatPassword").value;
    
    if(NewPassword == RetypePassword){
        alert("Password match");
        return true;
    }else{
        alert("Passowrd doesn't match.Please re-enter the password.");
        return false;
    }
}