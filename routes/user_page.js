var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('user_page');
})

// TODO : more get/post routes for user table manipulations

module.exports = router;