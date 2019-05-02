var express = require('express');
var hbs = require('hbs');
var bodyParser = require('body-parser');

var app = express();
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

var Page = {
        Root:           '/',
        Dashboard:      'Dashboard',
        Login:          'Login',
        AdminWebPage:   'AdminWebPage',        
        Reset:          'Reset',
        SignupAdmin:    'SignupAdmin',
        SignupUser:     'SignupUser',
        CreatePassword: 'CreatePassword',
        UserWebpage:    'UserWebpage'        
};

///////////////////////////////////////////////////////////////////////////////
// Helper Functions
///////////////////////////////////////////////////////////////////////////////
/*
Function checks for username and password not found in the database.
*/
function IsAccountValid(login_name, login_password){
    // TODO: Need to add logic to check user provided login credential with database
    // login match - return true
    // login does not match - return false
    
    // remove below line after above logic is added
    return true;
}

/*
Function checks if user is admin or user.
*/
function IsAdminAccount(Name){
    // TODO: Need to add logic for database query to return admin or not.
    // Check with Kenn and Aseem how is admin vs user setup in SQL table.
    // user account is admin - return true
    // user account is not admin - return false
    
    // remove below line after above logic is added
    return true;
}

/*
Function checks for username and security password in the database.
*/
function IsSecurityPasswordValid(Name, SecurityQuestion, SecurityAnswer){
    // TODO: Need to add logic to check user provided login credential with database
    // login match - return true
    // login does not match - return false
    
    // remove below line after above logic is added
    return true;
}


///////////////////////////////////////////////////////////////////////////////
// GET Methods
///////////////////////////////////////////////////////////////////////////////
app.get(Page.Root, function (req, res) {
    return res.render(Page.Dashboard);
});

app.get(Page.Root.concat(Page.Reset), function (req, res) {
    return res.render(Page.Reset);
});

app.get(Page.Root.concat(Page.Login), function (req, res) {
    return res.render(Page.Login);
});

app.get(Page.Root.concat(Page.SignupAdmin), function (req, res) {
    return res.render(Page.SignupAdmin);
});

app.get(Page.Root.concat(Page.SignupUser), function (req, res) {
    return res.render(Page.SignupUser);
});

app.get(Page.Root.concat(Page.CreatePassword), function (req, res) {
    return res.render(Page.CreatePassword);
});

app.get(Page.Root.concat(Page.UserWebpage), function (req, res) {
    return res.render(Page.UserWebpage);
});

app.get(Page.Root.concat(Page.AdminWebPage), function (req, res) {
    return res.render(Page.AdminWebPage);
});



///////////////////////////////////////////////////////////////////////////////
// POST methods
///////////////////////////////////////////////////////////////////////////////
app.post(Page.Root.concat(Page.Login), function (req, res) {
    // store POST request data into variable
    var LoginForm = {
        Username: req.body.Username,
        Password: req.body.Password
    };
    
    // debug code: print user login credentials
    console.log("Login POST() method recieved: ");    
    console.log(LoginForm);

    // validate user credential with database
    if(IsAccountValid(LoginForm.Username, LoginForm.Password) == true){
        // user credential found therefore check for user account type is
        // admin or not
        if(IsAdminAccount(LoginForm.Username) == true) {
            // redirect to load the admin page
            return res.redirect(Page.UserWebpage);
        } else {
            // redirect to load the user page
            return res.redirect(Page.SignupUser);
        }
    } 

    // report login failed to the login HTML page
    return res.render(Page.Login, {LoginStatus: "Login Failed: Incorrect login credentials"});    
});

app.post(Page.Root.concat(Page.Reset), function (req, res) {
    // store POST request data into variable
    var ResetForm = {
        Username: req.body.Username,
        SecurityQuestion: req.body.SecurityQuestion,
        SecurityAnswer: req.body.SecurityAnswer
    };
    
    // debug code: print user reset credentials 
    console.log("Reset POST() method recieved: ");
    console.log(ResetForm);

    // validate user credential with database
    if(IsSecurityPasswordValid(ResetForm.Username, ResetForm.SecurityQuestion, ResetForm.SecurityAnswer) == true){
        // redirect to load the user page
        return res.redirect(Page.CreatePassword);
    } 

    // report reset failed to the reset HTML page
    return res.render(Page.Reset, {ConfirmPasswordStatus: "Reset Failed: Incorrect credentials"});    
});

app.post(Page.Root.concat(Page.CreatePassword), function (req, res) {
    // store POST request data into variable
    var CreatePasswordForm = {
        NewPassword: req.body.NewPassword,
        RepeatPassword: req.body.RepeatPassword,
    };
    
    // debug code: print user new credentials
    console.log("CreatePassword POST() method recieved: ");    
    console.log(CreatePasswordForm);

    // validate user credential.
    if(CreatePasswordForm.NewPassword == CreatePasswordForm.RepeatPassword) {
            // redirect to load the login page
            return res.redirect(Page.Login);
    } 

    // report matching password failed to the CreatePassword HTML page
    return res.render(Page.CreatePassword, {ConfirmPasswordStatus: "Passowrd doesn't match.Please re-enter the password."});    
});
 
app.listen(3000, function() {
    console.log('express-handlebars example server listening on: 3000');
});
