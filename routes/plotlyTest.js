var express = require('express');
var router = express.Router();
const auth = require('../utilities/authenticate');

router.get('/', (req, res) => {
    if( auth.isLoggedIn() === 0 ){
        return;
    }
    res.render('plotlyTest');
})


module.exports = router;