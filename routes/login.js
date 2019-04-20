var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('Login');
})

router.get('/signup', (req, res) => {
    res.render('Signup');
})

module.exports = router;