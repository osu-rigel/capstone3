const express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

try{
    let db = openDatabase();
    db.serialize( () => {
        //db.run("CREATE TABLE awards(award_type Int, awardee_name text, awardee_email text, awarder_ID Int, timestamp Int)");
        db.run(`INSERT INTO awards (award_type, awardee_name, awardee_email, awarder_ID, timestamp) VALUES (?, ?, ?, ?, ?)`, [1, 'Ken', 'kenhallthe3rd@gmail.com', 4, 123456], (err) => {
            if(err){
                console.error(err);
            }
        });
    })
    db.close( (err) => {
        if(err){
            console.error(err);
        }
    })
} catch(err) {
    console.error(err);
}

router.get('/searchByEmail/:email', (req, res) => {
    var email = req.params['email'];
    console.log(email);
    var db = openDatabase();
    var results = []
    db.serialize( () => {
        db.all("SELECT * FROM awards WHERE awardee_email = ?", [email], (err, matches) => {
            for( match in matches ){
                console.log(matches[match]);
                results.push(matches[match]);
            }
            res.send(results);
        });
    })
    db.close( (err) => {
        if(err){
            console.error(err);
        }
    })
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