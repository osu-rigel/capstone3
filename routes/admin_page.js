var express = require('express');
var router = express.Router();
const auth = require('../utilities/authenticate.js');
const db = require ('../utilities/db.js');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var passport   = require('passport')

router.get('/', (req, res) => {
    if( auth.isAdminLoggedIn(req,res) === 0 ){
        return;
    }
    res.render('admin_page');
})



// Admin login page.
router.get('/login', function(req, res) {
  
  res.render('AdminLogin');
});


router.post('/login', passport.authenticate(
    'local_admin',{
        successRedirect:'/admin',
        failureRedirect: '/admin/login'
}));



// Admin signup routes.
router.get('/signup', (req, res) => {
    res.render('SignupAdmin');
})



router.post('/signup', function(req, res, next) {
    console.log (req.body);
    //const firstname = req.body.firstname;
    //const lastname  = req.body.lastname;
    const email     = req.body.email;
    const password  = req.body.password;
     
   
    // To hash the password.
    bcrypt.hash(password, saltRounds, function(err, hash) {   
        // Store hash in your password DB.
       var dbConnection = db.connect();
        dbConnection.query('Insert INTO admin (email,password) VALUES (?,?)',[email , hash],function(error,results,fields){  // These ? help prevent SQL injection attacks by escaping. The MYSQL packages automatically escapes values.
            if(err) throw error;
            dbConnection.query('SELECT user_id FROM admin WHERE email = ?', [email],function(error,results,fields) 
            {
                if(err) throw error;
                console.log(results[0]);
                const user_id = results[0];
                console.log("Admin id: ")
                console.log(results[0]);
                
                //console.log("Admin id is:"+ results[0].user_id);
                req.login(user_id,function(err){
                    res.redirect('/admin');
                    db.disconnect(dbConnection);
                });
            });
            // else render this page.
        });
        
    });
});

// Display admin users.
router.get('/showadmin',function(req,res,next){
    
    var query = 'select * from admin';
    var dbConnection = db.connect();
     dbConnection.query(query, function(err, rows, fields) {
       if (err) throw err;
       res.render('showadmin', { title: 'Admin List', admins: rows});
       db.disconnect(dbConnection);
       
    })
});


// Display users.

router.get('/showuser',function(req,res,next){
    
   var query = 'select * from users';
    var dbConnection = db.connect();
     dbConnection.query(query, function(err, rows, fields) {
       if (err) throw err;
       res.render('showuser', { title: 'User List', users: rows});
       db.disconnect(dbConnection);
       
    })
   
});

router.get('/newuser',function(req,res,next){
    
    res.render('addUser');
    //res.send("This will be the new user route.");
   
});

router.post('/newuser', function(req, res, next) {
  global.upload(req,res,function(err){
        if(err){
            res.render('addUser',{msg:err});
            console.log(err);
        }else{
         
          console.log("The file object is as shown below.");
          console.log(req.file);
          const firstname = req.body.firstname;
          const lastname  = req.body.lastname;
          const email     = req.body.email;
          const password  = req.body.password;
          const filename  = req.file.filename;
          const filetype  = req.file.mimetype;
          const filesize  = req.file.size;
          
          console.log("The file object is as shown below.");
          console.log(req.file);
          
          // Pull the database here.
          //const db = require ('../db.js');           // To go down one directory we use .. here.
         
         
          // To hash the password.
          bcrypt.hash(password, saltRounds, function(err, hash) {   
             var dbConnection = db.connect();
            // Store hash in your password DB.
              dbConnection.query('Insert INTO users (email,firstname, lastname, password,filename,filetype, filesize) VALUES (?,?,?,?,?,?,?)',[email,firstname, lastname, hash,filename,filetype,filesize],function(error,results,fields){  // These ? help prevent SQL injection attacks by escaping. The MYSQL packages automatically escapes values.
                if(error) {
                    console.log(error);
                }   
                
                res.redirect('/admin/showuser');
                db.disconnect(dbConnection);
                    
              });
          });
            
            
            
        }
        
    });  

     
});


// Adding new admin users.
router.get('/newadmin',function(req,res,next){
    res.render('addAdmin');
    //res.send("This will be the new admin route.");
});




router.post('/newadmin', function(req, res, next) {
    
    const email     = req.body.email;
    const password  = req.body.password;
     
   
    // To hash the password.
    bcrypt.hash(password, saltRounds, function(err, hash) {   
        // Store hash in your password DB.
       var dbConnection = db.connect();
        dbConnection.query('Insert INTO admin (email,password) VALUES (?,?)',[email , hash],function(error,results,fields){  // These ? help prevent SQL injection attacks by escaping. The MYSQL packages automatically escapes values.
            if(error) {
               console.log(error);
            }
            res.redirect('/admin/showadmin');
            db.disconnect(dbConnection);
            
            // else render this page.
        });
        
    });
});


module.exports = router;