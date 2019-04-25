var express = require('express');
var router = express.Router();
var passport   = require('passport')


var bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET home page. */
router.get('/', function(req, res) {
  //console.log(req);
  console.log(req.user);
  console.log(req.isAuthenticated());
  res.render('home', { title: 'Home' });
});

// User profile page.
router.get('/profile', isLoggedIn(),function(req, res) {
  console.log(req.user.firstname);
  res.render('profile', { title: 'Profile',name: req.user.firstname });
});


// login page.
router.get('/login', function(req, res) {
  
  res.render('login');
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




// Admin routes go here....

// Admin profile page.
router.get('/adminprofile', isAdminLoggedIn(),function(req, res) {
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
  
  // Authentication middleware function try one for user and one for admin.
  function isLoggedIn() {
     return (req,res,next)=>{
         if(req.isAuthenticated()) return next();
         
         res.redirect('/login');
     }
 
   }

    function isAdminLoggedIn() {
     return (req,res,next)=>{
         if(req.isAuthenticated()) return next();
         
         res.redirect('/adminlogin');
     }
 
   }





module.exports = router;