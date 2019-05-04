var express = require('express');
var router = express.Router();
const auth = require('../utilities/authenticate.js');
const db = require ('../db.js');
var bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/', (req, res) => {
    if( auth.isAdminLoggedIn === 0 ){
        return;
    }
    res.render('admin_page');
})

router.get('/signup', (req, res) => {
    res.render('SignupAdmin');
})

router.post('/adminlogin', passport.authenticate(
    'local_admin',{
        successRedirect:'/adminprofile',
        failureRedirect: '/adminlogin'
    }
)); 

router.post('/adminregister', function(req, res, next) {
    console.log (req.body);
    //const firstname = req.body.firstname;
    //const lastname  = req.body.lastname;
    const email     = req.body.email;
    const password  = req.body.password;
   
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


module.exports = router;