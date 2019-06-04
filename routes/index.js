var express = require('express');
var router = express.Router();
var passport   = require('passport')
const auth = require('../utilities/authenticate.js');
const db = require ('../utilities/db.js');
var async = require('async');
var crypto = require('crypto');
var bcrypt = require('bcrypt');
const saltRounds = 10;
const emailer = require('../utilities/emailer.js');

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
        context.layout = false;
        complete();
    });
    db.disconnect(dbConnection);
}



/* GET home page. */
router.get('/', function(req, res){
  if(req.isAuthenticated()){
     if((req.user.user_type) === undefined){                        // Check if admin is logged in.
        res.redirect('/admin');
    }else if (req.user.user_type){                       // Check if user is logged in.
        res.redirect('/user_page');
    }
  }
  else {
     res.render('Dashboard', {
      layout: false
   });
 }
 
});

// forgot password link
router.get('/forgot', function(req, res) {
  res.render('Forgot', {
        layout: false
    });
});



router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
        
      var dbConnection = db.connect();
      var email= req.body.email;
      dbConnection.query('SELECT * FROM users WHERE email = ?', [email],function(error,results,fields) 
      {
          if (error)
          {
              console.log(error);
              req.flash('error', 'No account with that email address exists.');
              return res.redirect('/reset');
          }
          
          results[0].resetPasswordToken = token;
          results[0].resetPasswordExpires = Date.now() + 3600000; // 1 hour

        //   user.save(function(err) {
        //   done(err, token, user);
        // });
        var sql = "UPDATE users SET resetPasswordToken=?, resetPasswordExpires=? WHERE email=?";
        var inserts = [results[0].resetPasswordToken,  results[0].resetPasswordExpires, email];
        var dbConnection = db.connect();
        dbConnection.query(sql,inserts,function(error, results, fields){
            //console.log(results[0]);
            if(error) throw error;
                                                                                          // Check how to dynamically show my user firstname changed.
        });
        dbConnection.query('SELECT * FROM users WHERE email = ?', [email],function(error,results,fields)
        {
          console.log(results[0]);
          done(error,token,results[0]); 
        });
        db.disconnect(dbConnection);
        
        // need to write an insert query here. 
        //console.log(results[0]);
          
      });
      
    },
    function(token, results, done) {
      var text = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\nhttp://' + req.headers.host + '/reset/' + token + '\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n';
      emailer(results.email, "Password Reset", text);
      setTimeout( () => {
        res.redirect('/');
      }, 2000);
      /*
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'osurigel@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      console.log("I am in Node mailer");
      console.log(results);
      var mailOptions = {
        to: results.email,
        from: 'osurigel@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('Mail sent')
        req.flash('success', 'An e-mail has been sent to ' + results.email + ' with further instructions.');
        done(err, 'done');
      });
      */

    }
  ], function(err) {
    if (err) return next(err);
    
    res.redirect('/forgot');
  });
});

// reset token routes

router.get('/reset/:token', function(req, res) {
  var dbConnection = db.connect();
  dbConnection.query('SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires >=? ', [req.params.token,Date.now()],function(error,results,fields) 
      {
          if (error)
          {
              req.flash('error', 'Password reset token is invalid or has expired.');
              return res.redirect('/forgot');
           }
    res.render('reset', {
      user: results[0],layout: false, token: req.params.token
    });
    
    
  });
  db.disconnect(dbConnection);
});


router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
       var dbConnection = db.connect();
      dbConnection.query('SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires >=? ', [req.params.token,Date.now()],function(error,results,fields) 
      {
          if (error)
          {
              req.flash('error', 'Password reset token is invalid or has expired.');
              return res.redirect('/forgot');
           }
           
        console.log("I am in reset post route");
        console.log(results[0]);
        results[0].password = req.body.password;
        results[0].resetPasswordToken = undefined;
        results[0].resetPasswordExpires = undefined;
        var id = results[0].user_id;
        console.log("Id is : "+ id);
        
        bcrypt.hash(results[0].password, saltRounds, function(err, hash) {  
          var sql = "UPDATE users SET password=? , resetPasswordToken=?, resetPasswordExpires=? WHERE user_id=?";
          var inserts = [hash, results[0].resetPasswordToken,  results[0].resetPasswordExpires, results[0].user_id];
          var dbConnection = db.connect();
          dbConnection.query(sql,inserts,function(error, results, fields){
              //console.log(results[0]);
              if(error) throw error;
                                                                                      // Check how to dynamically show my user firstname changed.
          });
          
        });
        console.log(id);
        dbConnection.query('SELECT * FROM users WHERE user_id = ?', [id],function(error,results,fields)
        {
          console.log(results[0]);
          done(error,results[0]); 
        });
        db.disconnect(dbConnection);
        
        
      });
    },
    function(results, done) {
      var text = 'Hello,\n\nThis is a confirmation that the password for your account ' + results.email + ' has just been changed.\n';
      emailer(results.email, "Password Reset", text);
      setTimeout( () => {
        res.redirect('/');
      }, 2000);
    }
  ], function(err) {
    res.redirect('/');
  });
});


// logout route
router.get('/logout', (req, res, next) => {
    
    req.logout()                                 // this only logs out of the application. Does not remove session.
    req.session.destroy(() => {                  // removes session.
        // req.flash("error", "Successfully logged out.");
        res.clearCookie('connect.sid');
        
        res.redirect('/')
    })
});


// Edit user logic goes here.

  /* Display one person for the specific purpose of updating people */

    router.get('/edit/:id', function(req, res){
      if( auth.isLoggedIn(req, res) === 0 ) {
        return;
      }
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
      if( auth.isLoggedIn(req, res) === 0 ) {
        return;
      }
        console.log(req.body)
        console.log(req.params.id)
        var sql = "UPDATE users SET firstname=?, lastname=? WHERE user_id=?";
        var inserts = [req.body.firstname, req.body.lastname, req.params.id];
        var dbConnection = db.connect();
        dbConnection.query(sql,inserts,function(error, results, fields){
            if(error) {
              console.log(error);
              req.flash("error", "unable to change username");
            } else {
              req.flash("success", "Username updated successfully. Please logout and login again to see changes");
            }
            res.redirect('/user_page');                                                                      // Check how to dynamically show my user firstname changed.
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