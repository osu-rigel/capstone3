const express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// init database 
if( !fs.existsSync('./database' ) ){
    fs.mkdirSync('./database');
}
if( !fs.existsSync('./database/awards.db') ){
    fs.writeFileSync('./database/awards.db', null, null);
}
var db = openDatabase;
db.run("CREATE TABLE IF NOT EXISTS awards (id INTEGER PRIMARY KEY AUTOINCREMENT, award_type INTEGER, awardee_name TEXT, awardee_email TEXT, awarder_ID INTEGER, timestamp INTEGER)")
closeDatabase(db);

router.get('/search/:field/:value', (req, res) => {
    var db = openDatabase();
    var results = []
    db.serialize( () => {
        db.all("SELECT * FROM awards WHERE ? = ?", [req.params['field'], req.params['value']], (err, matches) => {
            for( match in matches ){
                console.log(matches[match]);
                results.push(matches[match]);
            }
            res.send(results);
        });
    })
    closeDatabase(db);
});

router.post('/addAward', (req, res) => {
    if( req.body['award_type'] === undefined || req.body['awardee_name'] === undefined || req.body['awardee_email'] == undefined || req.body['awarder_ID'] === undefined || req.body['timestamp'] === undefined ){
        res.sendStatus(400);
        return;
    }
    var db = openDatabase();
    db.serialize( () => {
        db.run("INSERT INTO awards names (award_type, awardee_name, awardee_email, awarder_ID, timestamp) VALUES (?, ?, ?, ?, ?)", [req.body['award_type'], req.body['awardee_name'], req.body['awardee_email'], req.body['awarder_ID'], req.body['timestamp']], (err) => {
            if(err){
                console.error(err);
            }
        })
    })
    closeDatabase(db);
    res.sendStatus(200);
});

router.post('/deleteAward/', (req, res) => {
    var db = openDatabase();
    db.run("DELETE FROM awards where ? = ?", [req.body['field'], req.body['value']], (err) => {
        if(err){
            console.error(err);
        }
    })
    closeDatabase(db);
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