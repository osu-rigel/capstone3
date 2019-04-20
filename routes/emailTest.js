var express = require('express');
var router = express.Router();
const emailer = require('../utilities/emailer.js');

router.get('/', (req, res) => {
    emailer();
    res.sendStatus(200);
})


module.exports = router;