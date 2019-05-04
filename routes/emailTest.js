var express = require('express');
var router = express.Router();
const emailer = require('../utilities/emailer.js');
const auth = require('../utilities/authenticate.js');

router.get('/', (req, res) => {
    if( auth.isLoggedIn(req,res) === 0 ){
        return;
    }
    emailer("hallkenn@oregonstate.edu, prashara@oregonstate.edu, mistrya@oregonstate.edu", "CAPSTONE EMAIL TEST", "<h1>HELLO WORLD</h1>", './database/test_attach.jpg');
    res.sendStatus(200);
})


module.exports = router;