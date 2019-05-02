var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('admin_page');
})

router.get('/signup', (req, res) => {
    res.render('SignupAdmin');
})

// TODO : table manipulation routes

module.exports = router;