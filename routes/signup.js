var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require ('../utilities/db.js'); 

router.get('/', (req, res) => {
   
    res.render('SignupUser');

})

router.post('/register', function(req, res, next) {
    console.log (req.body);
    const firstname = req.body.Firstname;
    const lastname  = req.body.Lastname;
    const email     = req.body.Username;
    const password  = req.body.Password;
  
     console.log("signup POST() method recieved in signup.js");
    // Pull the database here.
   
    // To hash the password.
    bcrypt.hash(password, saltRounds, function(err, hash) {   
        // Store hash in your password DB.
        var dbConnection = db.connect();
        dbConnection.query('Insert INTO users (email,firstname, lastname, password) VALUES (?,?,?,?)',[email,firstname, lastname, hash],function(error,results,fields){  // These ? help prevent SQL injection attacks by escaping. The MYSQL packages automatically escapes values.
            if(error){
                console.error(error);
            } 
            dbConnection.query("SELECT user_id FROM users WHERE email = ?", [email], (err, results)=> {
                if(err){
                    console.error(error);
                }
                const user_id = results[0]['user_id'];
                res.redirect('/user');
                db.disconnect(dbConnection);
            });
            // else render this page.
        });
    });  
});
module.exports = router;