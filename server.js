var express = require('express')
var path = require('path')
var app = express()
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var exphbs = require('express-handlebars')
var multer = require('multer')
var flash  = require('connect-flash')
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config/secret_info.json'));
const db = require('./utilities/db.js');

// Authentication stuff
var session  = require('express-session')
var MySQLStore = require('express-mysql-session')(session)  // To store sessions.
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy      // local strategy for authorizing using local database.
var bcrypt = require('bcrypt')
var async = require('async')
var crypto = require('crypto')

// Set storage engine
var storage = multer.diskStorage({
    destination:'./public/uploads',
    filename:function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));  
    }
})

// Initialize upload.

global.upload = multer({
    storage: storage,
    limits: {fileSize:1000000},
    fileFilter:function(req,file,cb){
        checkFileType(file,cb);    
    }
}).single('myImage');


// checkFileType function 

function checkFileType(file,cb){
    const filetypes = /jpeg|jpg|png/;              // regular expression.
    
    // check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    // check mimetype
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname){
        return cb(null,true);
    }else{
        cb("Err: Images only");
    }
};


//For Handlebars
app.set('views', './views');
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
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use(function(req,res,next){
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});

//routes
const index = require('./routes/index')
app.use('/', index);
const emailTest = require('./routes/emailTest');
app.use('/emailTest', emailTest);
const plotlyTest = require('./routes/plotlyTest');
app.use('/plotlyTest', plotlyTest);
const awards = require('./routes/awards');
app.use('/awards', awards);
const signup = require('./routes/signup');
app.use('/signup', signup);
const admin = require('./routes/admin_page');
app.use('/admin', admin);
const login = require('./routes/login');
app.use('/login', login);
const uploadFile = require('./routes/uploadfile');
app.use('/upload', uploadFile);
const user = require('./routes/user_page');
app.use('/user_page', user);

passport.use('local_user',new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        console.log(email);
        console.log(password);
    
        // handle error for invalid email as well.
        // This will give us user_id ,firstname and password in results.We can modify admin in similar fashion.
        var dbConnection = db.connect();
        dbConnection.query('SELECT user_id,firstname, password,user_type FROM users WHERE email=?',[email],function(err,results,fields){
            if(err){
                done(err) };
            console.log("Results length is: "+ results.length);
            if(results.length===0){
                return done(null,false);                                                // needed a return to handle case where email is not in the database.
            }
        
            console.log(results[0].password);
            const hash = results[0].password;
        
            bcrypt.compare(password,hash,function(err,response){
                console.log("The response is: ");
                console.log(response);
                
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
        db.disconnect(dbConnection);
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
    
        // handle error for invalid email as well.
        var dbConnection = db.connect();
        dbConnection.query('SELECT user_id, password FROM admin WHERE email=?',[email],function(err,results,fields){
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
        db.disconnect(dbConnection);
    }
));

app.listen(config['PORT_NUM'],function(err) {
 
    if (!err)
        console.log("Site is live");
    else console.log(err)
 
});