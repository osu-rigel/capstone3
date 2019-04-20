const express = require('express');

var app = express();

app.set('view engine', 'hbs');
app.set('views', './views');
app.use(express.static('public'));

const login = require('./routes/login.js');
const user_page = require('./routes/user_page.js');

app.use('/login', login);
app.use('/user_page', user_page);

app.listen(12223, () => {
    console.log("Server started");
})