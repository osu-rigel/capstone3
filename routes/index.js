var express = require('express');
var router = express.Router();
var passport   = require('passport')
var bcrypt = require('bcrypt');
const saltRounds = 10;
const authUtil = require('../utilities/authenticate.js');

function getPerson(res, db, context, user_id, complete){
       
        var sql = "SELECT user_id, firstname, lastname FROM users WHERE user_id = ?";
        var inserts = [user_id];
        db.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            console.log("I am in get person function.")
            console.log(results[0]);
            context.person = results[0];
            complete();
        });
    }



/* GET home page. */
router.get('/', function(req, res) {
  //console.log(req);
  console.log(req.user);
  console.log(req.isAuthenticated());
  res.render('home', { title: 'Home' });
});

// User profile page.
router.get('/profile', (req, res, next) => {
  if( !authUtil.isLoggedIn(req,res) ){
    return;
  }
  console.log(req.user.firstname);
  console.log ("The below options show req.user id ");
  console.log(req.user.user_id);
  res.render('profile', { title: 'Profile',name: req.user.firstname, id: req.user.user_id });
});


// login page.
router.get('/Login', function(req, res) {
  res.render('Login');
});


router.post('/login', passport.authenticate(
    'local_user',{
      successRedirect:'/profile',
      failureRedirect: '/login'
    }));

// logout route
router.get('/logout', (req, res, next) => {
    req.logout()                                 // this only logs out of the application. Does not remove session.
    req.session.destroy(() => {                  // removes session.
        res.clearCookie('connect.sid')
        res.redirect('/')
    })
});

// register the user.
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});


router.post('/register', function(req, res, next) {
    
  console.log (req.body);
  const firstname = req.body.firstname;
  const lastname  = req.body.lastname;
  const email     = req.body.email;
  const password  = req.body.password;
  
  // Pull the database here.
  const db = require ('../db.js');           // To go down one directory we use .. here.
 
 
  // To hash the password.
  bcrypt.hash(password, saltRounds, function(err, hash) {   
    // Store hash in your password DB.
      db.query('Insert INTO users (email,firstname, lastname, password) VALUES (?,?,?,?)',[email,firstname, lastname, hash],function(error,results,fields){  // These ? help prevent SQL injection attacks by escaping. The MYSQL packages automatically escapes values.
        if(error) throw error;
            
        db.query('SELECT LAST_INSERT_ID() AS user_id',function(error,results,fields){
            if(err) throw error;
            const user_id = results[0];
            console.log("User id is: ");
            console.log(user_id);
            console.log(results[0]);
            // console.log("User id is: "+ results[0].user_id);
            //console.log(results[0].hello);
            //console.log("Above line should be undefined");
            req.login(user_id,function(err){
                res.redirect('/profile');
            });
        });
          // else render this page.
      });
  });
     
});

// Edit user logic goes here.

  /* Display one person for the specific purpose of updating people */

    router.get('/edit/:id', function(req, res){
         if( !authUtil.isLoggedIn(req,res) ){
           return;
          }
      
        var callbackCount = 0;
        var context = {};
       // context.jsscripts = ["updateperson.js"];
         const db = require ('../db.js');
        //var mysql = req.app.get('mysql');
        console.log("Id in req.params is: ");
        console.log(req.params.id);
        console.log (context);
        getPerson(res, db, context, req.params.id, complete);
        
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-person', context);
            }

        }
    });

/* The URI that update data is sent to in order to update a person */

    router.post('/edit/:id', function(req, res,next){
        if( !authUtil.isLoggedIn(req,res) ){
           return;
          }
        const db = require ('../db.js');
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE users SET firstname=?, lastname=? WHERE user_id=?";
        var inserts = [req.body.firstname, req.body.lastname, req.params.id];
        db.query(sql,inserts,function(error, results, fields){
            if(error) throw error;
            res.render('profile', { title: 'Profile',name: req.body.firstname, id: req.params.id });
        });
    });




// Admin routes go here....

// Admin profile page.
router.get('/adminprofile', (req, res) => {
  if( !authUtil.isAdminLoggedIn(req, res) ){
    return;
  }
  console.log(req.user);
  res.render('adminprofile', { title: 'Admin Profile' });
});


// Admin login page.
router.get('/adminlogin', function(req, res) {
  
  res.render('adminlogin');
});


router.post('/adminlogin', passport.authenticate(
    'local_admin',{
        successRedirect:'/adminprofile',
        failureRedirect: '/adminlogin'
}));

 
 // register the admin.
router.get('/adminregister', function(req, res, next) {
  res.render('adminregister', { title: 'Admin Register' });
});


router.post('/adminregister', function(req, res, next) {
    
  console.log (req.body);
  //const firstname = req.body.firstname;
  //const lastname  = req.body.lastname;
  const email     = req.body.email;
  const password  = req.body.password;
  
  // Pull the database here.
  const db = require ('../db.js');           // To go down one directory we use .. here.
 
 
  // To hash the password.
  bcrypt.hash(password, saltRounds, function(err, hash) {   
    // Store hash in your password DB.
      db.query('Insert INTO admin (email,password) VALUES (?,?)',[email , hash],function(error,results,fields){  // These ? help prevent SQL injection attacks by escaping. The MYSQL packages automatically escapes values.
        if(error)
            throw error;
            
        db.query('SELECT LAST_INSERT_ID() AS user_id',function(error,results,fields){
            if(err) throw error;
            const user_id = results[0];
            console.log("Admin id: ")
            console.log(results[0]);
            
            //console.log("Admin id is:"+ results[0].user_id);
            req.login(user_id,function(err){
                res.redirect('/adminprofile');
            });
        });
        // else render this page.
    });
  });
});

passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
  done(null, user_id);
});

module.exports = router;