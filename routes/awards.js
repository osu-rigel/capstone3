const express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// database check/initialization
try{
    var databaseChecker = fs.readFileSync('./database/awards.db');
} catch(err) {
    // unable to open database file; initialize database
    var db = openDatabase();
    db.serialize( () => {
        db.run("CREATE TABLE awards (award_type Int, awardee_name Varchar, awardee_email Varchar, awarder_ID Int, timestamp Int");
        db.run("INSERT INTO awards VALUES (1, Ken, kenhallthe3rd@gmail.com, 4, 958754");
    })
    db.close( (err) => {
        if(err){
            console.error(err);
        }
    })
}

router.get('/searchByEmail/:email', (req, res) => {
    var email = req.param['email'];
    var db = openDatabase();
    db.serialize( () => {
        db.all("SELECT * FROM awards WHERE awardee_email = ?", [email], (err, matches) => {
            for( match in matches ){
                console.log(matches[match]);
            }
        });
    })
})

module.exports = router;

function openDatabase(){
    var db = new sqlite3.Database('./database/awards.db', sqlite3.OPEN_CREATE, (err) => {
        if(err){
            console.error(err);
        }
        console.log("Opened to fs-based database");
    });
    return db;
}