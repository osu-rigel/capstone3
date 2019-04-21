const express = require('express');
const session = require('express-session');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config/secret_info.json'));

var app = express();

app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static('public'));

//authentication + sessions
app.use(session({
    secret : config['SECRET'],
    cookie : {
        maxAge : 6000000
    }
}))

//page routes
const login = require('./routes/login.js');
const user_page = require('./routes/user_page.js');
const plotlyTest = require('./routes/plotlyTest.js');
const emailTest = require('./routes/emailTest.js');
const admin_page = require('./routes/admin_page.js');


app.use('/login', login);
app.use('/user_page', user_page);
app.use('/plotlyTest', plotlyTest);
app.use('/emailTest', emailTest);
app.use('/admin_page', admin_page);

app.listen(12223, () => {
    console.log("Server started");
})