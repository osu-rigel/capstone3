var express = require('express');
var router = express.Router();
const auth = require('../utilities/authenticate');

router.get('/', (req, res) => {
    if( auth.isLoggedIn() === 0 ){
        return;
    }
    res.render('user_page');
})

// TODO : more get/post routes for user table manipulations

module.exports = router;