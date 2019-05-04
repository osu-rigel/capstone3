var express = require('express');
var router = express.Router();
const auth = require('../utilities/authenticate.js');

router.get('/', (req, res) => {
    if( auth.isLoggedIn(req,res) === 0 ){
        return;
    }
    res.render('plotlyTest');
})


module.exports = router;