var express = require('express');
var router = express.Router();
var passport   = require('passport')
const authUtil = require('../utilities/authenticate.js');
const db = require ('../utilities/db.js');

function getPerson(res, context, user_id, complete){
    var sql = "SELECT user_id, firstname, lastname FROM users WHERE user_id = ?";
    var inserts = [user_id];
    var dbConnection = db.connect()
    dbConnection.query(sql, inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        console.log("I am in get person function.")
        console.log(results[0]);
        context.person = results[0];
        complete();
    });
    db.disconnect(dbConnection);
}



/* GET home page. */
router.get('/', function(req, res) {
  res.render('home', { title: 'Home' });
});

// User profile page.
router.get('/profile', (req, res, next) => {
  console.log(req.user.firstname);
  console.log ("The below options show req.user id ");
  console.log(req.user.user_id);
  res.render('profile', { title: 'Profile',name: req.user.firstname, id: req.user.user_id });
});

// logout route
router.get('/logout', (req, res, next) => {
    req.logout()                                 // this only logs out of the application. Does not remove session.
    req.session.destroy(() => {                  // removes session.
        res.clearCookie('connect.sid')
        res.redirect('/')
    })
});

// Edit user logic goes here.

  /* Display one person for the specific purpose of updating people */

    router.get('/edit/:id', function(req, res){
      
        var callbackCount = 0;
        var context = {};
       // context.jsscripts = ["updateperson.js"];
        //var mysql = req.app.get('mysql');
        console.log("Id in req.params is: ");
        console.log(req.params.id);
        console.log (context);
        getPerson(res, context, req.params.id, complete);
        
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-person', context);
            }

        }
    });

/* The URI that update data is sent to in order to update a person */

    router.post('/edit/:id', function(req, res,next){
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE users SET firstname=?, lastname=? WHERE user_id=?";
        var inserts = [req.body.firstname, req.body.lastname, req.params.id];
        var dbConnection = db.connect();
        dbConnection.query(sql,inserts,function(error, results, fields){
            if(error) throw error;
            res.render('profile', { title: 'Profile',name: req.body.firstname, id: req.params.id });
        });
        db.disconnect(dbConnection);
    });

passport.serializeUser(function(user_id, done) {
  done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
  done(null, user_id);
});

module.exports = router;