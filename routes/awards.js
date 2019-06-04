const express = require('express');
var router = express.Router();
const db = require ('../utilities/db.js');
const auth = require('../utilities/authenticate.js');
const emailer = require('../utilities/emailer.js');
const latex = require('node-latex');
const fs = require('fs');

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
    if( req.body['award_type'] === undefined || req.body['awardee_name'] === undefined || req.body['awardee_email'] == undefined || req.body['timestamp'] === undefined ){
        res.sendStatus(400);
        return;
    }
    // convert string date to numeric Unix timestamp for storage in table
    var unixDate = new Date(req.body['timestamp']);
    unixDate = unixDate.getTime() / 1000; 
    var dbConnection = db.connect();
    dbConnection.query("INSERT INTO emp_award (award_type, awardee_name, awardee_dept, awardee_region, awardee_email, awarder_ID, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)", [req.body['award_type'], req.body['awardee_name'], req.body['awardee_dept'], req.body['awardee_region'], req.body['awardee_email'], req.user['user_id'], unixDate], (err) => {
        if(err){
            console.error(err);
        }
        dbConnection.query("SELECT firstname, lastname, filename FROM users WHERE user_id = ?", [req.user.user_id], (error, results, fields) => {
            console.log(results);
            var signatureFilepath = __dirname + '/../public/uploads/' + results[0]['filename'];
            var latexTemplate = fs.readFileSync("./utilities/input.tex", "utf8");
            if( req.body['award_type'] === 1 ){
                var award_type = "Employee of the Month";
            } else {
                var award_type = "Employee of the Week";
            }
            latexTemplate = latexTemplate.replace('AWARD', award_type);
            latexTemplate = latexTemplate.replace('DATE', req.body['timestamp']);
            latexTemplate = latexTemplate.replace('RECIPIENT', req.body['awardee_name']);
            latexTemplate = latexTemplate.replace('GIVER', results[0]['firstname'] + " " + results[0]['lastname']);
            latexTemplate = latexTemplate.replace('SIGNATURE', signatureFilepath);
            if( !fs.existsSync('./utilities/PDFs') ){
                fs.mkdirSync('./utilities/PDFs');
            }
            var pdfSaveStream = fs.createWriteStream('./utilities/PDFs/output.pdf');
            var pdf = latex(latexTemplate);
            pdf.pipe(pdfSaveStream);
            pdf.on('finish', () => {
                emailer(req.body['awardee_email'], "You have received an award", "<p>See attached for your award</p>", "./utilities/PDFs/output.pdf");
            })
            db.disconnect(dbConnection);
        })

    })

    res.redirect('/user_page');
});

router.get('/addAward', (req, res) => {
    if( auth.isLoggedIn(req, res) === 0 ){
        return;
    }
    res.render('addaward', {
        layout: false
    });
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
    res.redirect('/user_page');
})

module.exports = router;