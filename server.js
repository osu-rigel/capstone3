var express = require('express')
var path = require('path')
var app = express()
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var exphbs = require('express-handlebars')
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config/secret_info.json'));

// Authentication stuff
var session  = require('express-session')
var MySQLStore = require('express-mysql-session')(session)  // To store sessions.
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy      // local strategy for authorizing using local database.
var bcrypt = require('bcrypt')
var index = require('./routes/index')

//For Handlebars
app.set('views', './views')
app.engine('hbs', exphbs({extname: '.hbs'}));
app.set('view engine', '.hbs');

//For BodyParser

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.static('public'));

var options = {
    host     : 'remotemysql.com',
    port     :  3306,
    user     : 'ShTfB8icwf',
    password : 'ObcoP11fFs',
    database : 'ShTfB8icwf',
};

var sessionStore = new MySQLStore(options);

app.use(session({
    secret: 'asdfasfovasvsdasvs',
    resave: false,
    store: sessionStore,
    saveUninitialized: false,              // no cookies will be stored for unauthorized users.
    //cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next){
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});

app.use('/', index);

passport.use('local_user',new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        console.log(email);
        console.log(password);
    
        const db = require('./db');
        // handle error for invalid email as well.
        // This will give us user_id ,firstname and password in results.We can modify admin in similar fashion.
        db.query('SELECT user_id,firstname, password FROM users WHERE email=?',[email],function(err,results,fields){
            if(err){
                done(err) };
            console.log("Results length is: "+ results.length);
            if(results.length===0){
                return done(null,false);                                                // needed a return to handle case where email is not in the database.
            }
        
            console.log(results[0].password);
            const hash = results[0].password;
        
            bcrypt.compare(password,hash,function(err,response){
                if(response === true){
                    console.log(results[0].user_id);
                    console.log(results[0]);
                    //return done(null,{user_id: results[0].user_id});
                    return done(null,results[0]);   // passing the entire object to retrieve firstname as well.   
                }else{
                    return done(null,false);
                }
            });    
        })
    }
));

passport.use('local_admin',new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        console.log(email);
        console.log(password);
    
        const db = require('./db');
        // handle error for invalid email as well.
        db.query('SELECT user_id, password FROM admin WHERE email=?',[email],function(err,results,fields){
            if(err){
                done(err) };
            console.log("Results length is: "+ results.length);
            if(results.length===0){
                return done(null,false);                                                // needed a return to handle case where email is not in the database.
            }
        
            console.log(results[0].password);
            const hash = results[0].password;
        
        
            bcrypt.compare(password,hash,function(err,response){
            
                if(response === true){
                    console.log(results[0].user_id);
                    return done(null,{user_id: results[0].user_id});
                }else{
                    return done(null,false);
                } 
            });
        })
    }
));

app.listen(config['PORT_NUM'], (err) => { 
    if(!err){
        console.log("Site is live");
    } else {
        console.log(err)
    } 
});