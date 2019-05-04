var express = require('express');
var router = express.Router();
const auth = require('../utilities/authenticate.js');

router.get('/', (req, res) => {
    if( auth.isAdminLoggedIn === 0 ){
        return;
    }
    res.render('admin_page');
})

router.get('/signup', (req, res) => {
    res.render('SignupAdmin');
})

// TODO : table manipulation routes

module.exports = router;