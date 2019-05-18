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
    res.render('admin_page', {
        layout: false
    });
})



// Admin login page.
router.get('/login', function(req, res) {
  
  res.render('AdminLogin', {
      layout: false
  });
});


router.post('/login', passport.authenticate(
    'local_admin',{
        successRedirect:'/admin',
        failureRedirect: '/admin/login'
}));



// Admin signup routes.
router.get('/signup', (req, res) => {
    res.render('SignupAdmin', {
        layout: false
    });
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



module.exports = router;