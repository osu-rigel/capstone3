const express = require('express');
var router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// init database 
if( !fs.existsSync('./database' ) ){
    fs.mkdirSync('./database');
}
if( !fs.existsSync('./database/awards.db') ){
    fs.writeFileSync('./database/awards.db', "");
    var db = new sqlite3.Database('./database/awards.db', sqlite3.OPEN_CREATE ,(err) => {
        if(err){
            console.error(err);
        }
    });
    closeDatabase(db);
}
var db = openDatabase();
db.run("CREATE TABLE IF NOT EXISTS awards (id INTEGER PRIMARY KEY AUTOINCREMENT, award_type INTEGER, awardee_name TEXT, awardee_email TEXT, awarder_ID INTEGER, timestamp INTEGER)", [], (err) => {
    if(err){
        console.error(err);
    }
})
db.run("INSERT INTO awards (award_type, awardee_name, awardee_email, awarder_ID, timestamp) VALUES (?, ?, ?, ?, ?)", [1, 'Ken', 'kenhallthe3rd@gmail.com', 5, 1234567], (err) => {
    if(err){
        console.error(err);
    }
})
closeDatabase(db);



// routes
router.get('/search/:field/:value', (req, res) => {
    if( req.params['field'] === 'id' || req.params['field'] === 'award_type' || req.params['field'] === 'awardee_email' || req.params['field'] === 'awardee_name' || req.params['field'] === 'awarder_ID' || req.params['field'] === 'timestamp'){
        var parameter = req.params['field'];
    } else {
        res.sendStatus(400);
        return;
    }
    var results = [];
    var db = openDatabase();
    console.log(parameter + ":" + req.params['value']);
    db.each("SELECT * FROM awards WHERE " + parameter + " = ?", [req.params['value']], (err, matches) => {
        results.push(matches);
    }, () => {
        res.send(results);
        closeDatabase(db);
    });
});

router.post('/addAward', (req, res) => {
    if( req.body['award_type'] === undefined || req.body['awardee_name'] === undefined || req.body['awardee_email'] == undefined || req.body['awarder_ID'] === undefined || req.body['timestamp'] === undefined ){
        res.sendStatus(400);
        return;
    }
    var db = openDatabase();
    db.run("INSERT INTO awards (award_type, awardee_name, awardee_email, awarder_ID, timestamp) VALUES (?, ?, ?, ?, ?)", [req.body['award_type'], req.body['awardee_name'], req.body['awardee_email'], req.body['awarder_ID'], req.body['timestamp']], (err) => {
        if(err){
            console.error(err);
        }
    })
    closeDatabase(db);
    res.sendStatus(200);
});

router.post('/deleteAward/', (req, res) => {
    var db = openDatabase();
    db.serialize( () => {
        db.run("DELETE FROM awards where ? = ?", [req.body['field'], req.body['value']], (err) => {
            if(err){
                console.error(err);
            }
        })
    })
    closeDatabase(db);
    res.sendStatus(200);
})

router.get('/showAll', (req, res) => {
    res.render('showAll');
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