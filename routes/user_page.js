var express = require('express');
var router = express.Router();
const auth = require('../utilities/authenticate.js');

router.get('/', (req, res) => {
    if( auth.isLoggedIn(req, res) === 0 ){
        return;
    }
    // figure out what session they are on and dump them on their user page
    console.log(req.user);
    
    res.render('user_page', { title: 'Profile',name: req.user.firstname, id: req.user.user_id });
})

router.post('/', (request, res) => {
    var username = request.body.Username;
    var password = request.body.Password;
    console.log(username + ":" + password);
    // 
    res.render('user_page');
})


// TODO : more get/post routes for user table manipulations

module.exports = router;