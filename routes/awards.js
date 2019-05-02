const express = require('express');
var router = express.Router();
const fs = require('fs');
const db = require ('../db.js'); 

// init table
db.query("CREATE TABLE IF NOT EXISTS emp_award (award_id INTEGER PRIMARY KEY AUTOINCREMENT, award_type INTEGER, awardee_name TEXT, awardee_email TEXT, awarder_ID INTEGER, timestamp INTEGER, FOREIGN KEY (awarder_ID) REFERENCES emp_user(user_id))", [], (err) => {
    if(err){
        console.error(err);
    }
})

// routes
router.get('/search/:field/:value', (req, res) => {
    if( req.params['field'] === 'id' || req.params['field'] === 'award_type' || req.params['field'] === 'awardee_email' || req.params['field'] === 'awardee_name' || req.params['field'] === 'awarder_ID' || req.params['field'] === 'timestamp'){
        var parameter = req.params['field'];
    } else {
        res.sendStatus(400);
        return;
    }
    console.log(parameter + ":" + req.params['value']);
    db.query("SELECT * FROM awards WHERE " + parameter + " = ?", [req.params['value']], (err, result) => {
        res.send(result);
    });
});

router.post('/addAward', (req, res) => {
    if( req.body['award_type'] === undefined || req.body['awardee_name'] === undefined || req.body['awardee_email'] == undefined || req.body['awarder_ID'] === undefined || req.body['timestamp'] === undefined ){
        res.sendStatus(400);
        return;
    }
    db.query("INSERT INTO awards (award_type, awardee_name, awardee_email, awarder_ID, timestamp) VALUES (?, ?, ?, ?, ?)", [req.body['award_type'], req.body['awardee_name'], req.body['awardee_email'], req.body['awarder_ID'], req.body['timestamp']], (err) => {
        if(err){
            console.error(err);
        }
    })
    res.sendStatus(200);
});

router.post('/deleteAward/', (req, res) => {
    db.query("DELETE FROM awards where ? = ?", [req.body['field'], req.body['value']], (err) => {
        if(err){
            console.error(err);
        }
    })
    res.sendStatus(200);
})

module.exports = router;

function openDatabase(){
    let db = new sqlite3.Database('./database/awards.db', sqlite3.OPEN_READWRITE, (err) => {
        if(err){
            console.error(err);
        }
    });
    return db;
}

function closeDatabase(db){
    db.close( (err) => {
        if(err){
            console.error(err);
        }
    })
}