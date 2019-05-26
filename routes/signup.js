var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var passport   = require('passport');
const saltRounds = 10;
const db = require ('../utilities/db.js'); 

router.get('/', (req, res) => {
   
    res.render('SignupUser', {
      layout: false
  });

})



router.post('/', function(req, res, next) {
  global.upload(req,res,function(err){
        var msg = '';
        if(err){
           
            //msg = "Please check file type and file size.";
            req.flash("error","Please check file type and file size.");
            res.redirect('/signup');
            console.log(err);
            //console.log(msg);
        }else{
          console.log (req.body);
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
                if(error) throw error;
                
                console.log("File information is provided below: ");
                console.log(filename);
                console.log(filetype);
                console.log(filesize);
                req.flash("success","User account successfully registered.");
                res.redirect('/login');
                
                db.disconnect(dbConnection);
              });
          });
               
        }
    });  
});

module.exports = router;
