var express = require('express');
var router = express.Router();
const emailer = require('../utilities/emailer.js');

router.get('/', (req, res) => {
    emailer("hallkenn@oregonstate.edu, prashara@oregonstate.edu, mistrya@oregonstate.edu", "CAPSTONE EMAIL TEST", "<h1>HELLO WORLD</h1>");
    res.sendStatus(200);
})


module.exports = router;