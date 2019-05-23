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
        if(err){
            res.render('fileupload',{
              msg:err,
              layout: false
            });
            console.log(err);
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
                
                res.redirect('/login');
                // dbConnection.query('SELECT user_id,firstname FROM users WHERE email = ?', [email],function(error,results,fields){
                //     if(err) throw error;
                //     const user_id = results[0].user_id;
                //     const fname = results[0].firstname;
                    
                    
                //     console.log("THe results in register route is: ");
                //     console.log(results[0]);
                    
                //     req.login(user_id,function(err){
                //         // res.render('user_page',{ 
                //         //   name: fname, 
                //         //   id: user_id,
                //         //   layout: false
                //         // });
                //         res.redirect('/user_page');
                //         db.disconnect(dbConnection);
                //     });
                // });
                  // else render this page.
              });
          });
            
            
            
        }
        
    });  

     
});

module.exports = router;
