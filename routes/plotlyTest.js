var express = require('express');
var router = express.Router();
const auth = require('../utilities/authenticate.js');
const db = require ('../db.js');

router.get('/', (req, res) => {
    /*if( auth.isLoggedIn(req,res) === 0 ){
        return;
    }*/
    res.render('plotlyTest');
})

router.get('/awardsGiven', (req, res) => {
    /*if( auth.isLoggedIn(req,res) === 0 ){
        return;
    }*/

})

router.get('/awardsReceived', (req, res) => {
    /*if( auth.isLoggedIn(req,res) === 0 ){
        return;
    }*/
    var SQLparams = [];
    var SQLquery = "";
    if( req.query['field'] === undefined ){
        SQLquery = "SELECT * FROM emp_award";
    }
    db.query(SQLquery, SQLparams, (err, result) => {
        // parse the results
        var output = {};
        for( entry in result ){
            console.log(result[entry]);
        }
        res.send(JSON.stringify(output));
    });

})


module.exports = router;