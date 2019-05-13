const express = require('express');
var router = express.Router();
const fs = require('fs');
const db = require ('../utilities/db.js');
const auth = require('../utilities/authenticate.js');

// init table
var dbConnection = db.connect();
dbConnection.query("CREATE TABLE IF NOT EXISTS emp_award (award_id INTEGER PRIMARY KEY AUTO_INCREMENT, award_type INTEGER, awardee_name TEXT, awardee_dept TEXT, awardee_region TEXT, awardee_email TEXT, awarder_ID INTEGER, timestamp INTEGER, FOREIGN KEY (awarder_ID) REFERENCES emp_user(user_id))", [], (err) => {
    if(err){
        console.error(err);
    }
})
db.disconnect(dbConnection);

// routes
router.get('/search/:field/:value', (req, res) => {
    if( auth.isLoggedIn(req,res) === 0 ){
        return;
    }
    if( req.params['field'] === 'id' || req.params['field'] === 'award_type' || req.params['field'] === 'awardee_email' || req.params['field'] === 'awardee_name' || req.params['field'] === 'awarder_ID' || req.params['field'] === 'timestamp'){
        var parameter = req.params['field'];
    } else {
        res.sendStatus(400);
        return;
    }
    console.log(parameter + ":" + req.params['value']);
    var dbConnection = db.connect();
    dbConnection.query("SELECT * FROM emp_award WHERE " + parameter + " = ?", [req.params['value']], (err, result) => {
        res.send(result);
    });
    db.disconnect(dbConnection);
});

router.post('/addAward', (req, res) => {
    if( auth.isLoggedIn(req,res) === 0 ){
        return;
    }
    if( req.body['award_type'] === undefined || req.body['awardee_name'] === undefined || req.body['awardee_email'] == undefined || req.body['awarder_ID'] === undefined || req.body['timestamp'] === undefined ){
        res.sendStatus(400);
        return;
    }
    var dbConnection = db.connect();
    dbConnection.query("INSERT INTO emp_award (award_type, awardee_name, awardee_dept, awardee_region, awardee_email, awarder_ID, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)", [req.body['award_type'], req.body['awardee_name'], req.body['award_dept'], req.body['award_region'], req.body['awardee_email'], req.body['awarder_ID'], req.body['timestamp']], (err) => {
        if(err){
            console.error(err);
        }
    })
    db.disconnect(dbConnection);
    res.sendStatus(200);
});

router.get('/addAward', (req, res) => {
   // if( auth.isLoggedIn(req, res) === 0 ){
       // return;
   // }
    res.render('addaward');
})

router.post('/deleteAward/:award_id', (req, res) => {
    if( auth.isLoggedIn(req,res) === 0 ){
        return;
    }

    var dbConnection = db.connect();
    dbConnection.query("DELETE FROM emp_award WHERE award_id = ?", [req.params.award_id], (err) => {
        if(err){
            console.error(err);
        }
    })
    db.disconnect(dbConnection);
    res.render('user_page');
})

module.exports = router;