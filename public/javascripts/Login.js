/*
Function checks if user is admin or user.
*/
function IsAdminAccount(login_name){
    // TODO: Need to add logic for database query to return admin or not.
    // Check with Kenn and Aseem how is admin vs user setup in SQL table.
    
    // if(AccountType == admin){
    //    return true;
    // }
    // else {
        return false;
    // }
}

/*
Function checks for username and password not found in the database.
*/
function ValidateWithDatabase(login_name, login_password){
    // TODO: Need to add logic for databse verification and return true or false appropriatley.
    //return true;
}


/* 
Function checks for blank input for username and password,
incorrect input formats for username, username and
password not found in database.
*/
function ValidateLoginPage(){
    // Read the value of username and password input fields.
    var login_name = document.getElementById("Username").value;
    var login_password = document.getElementById("Password").value;
    
    // Email regular expression from https://emailregex.com/
    var regex_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    // Print the values of username and password for debug purpose.
    // alert(login_name + ' ' + login_password);
    
    // Check for emptry username and password field.
    if(login_name.length == 0){
        
        // Check for debug purpose.
        alert("Username is blank.");
        return false;
    }
    
    if(login_password.length == 0){
        alert("Password is blank.");
        return false;
    }
    
    // Check for invalid username.
    if(regex_email.test(login_name) == false){
        alert("This is invalid username format.");
        return false;
    }
    
    /*if(ValidateWithDatabase(login_name, login_password) == false){
        alert("Username and password not found in database.");
        return false;
    }
    
    // Make function call to open user or admin webpage.
    if(IsAdminAccount(login_name) == true){
        window.open("AdminWebpage.html);
    }else{
        window.open("UserWebpage.html);
    }*/
    
    return true;
    
}