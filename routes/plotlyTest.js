var express = require('express');
var router = express.Router();
const auth = require('../utilities/authenticate.js');
const db = require ('../utilities/db.js');

/*body = [
    {
        "award_type" : 2,
        "awardee_name" : "Ken",
        "award_dept" : "Backend",
        "award_region" : "Oregon",
        "awardee_email" : "kenhallthe3rd@gmail.com",
        "awarder_ID" : 7,
        "timestamp" : 13579
    },
    {
        "award_type" : 2,
        "awardee_name" : "Ankita",
        "award_dept" : "Frontend",
        "award_region" : "California",
        "awardee_email" : "anmistry@gmail.com",
        "awarder_ID" : 4,
        "timestamp" : 12789
    },
    {
        "award_type" : 1,
        "awardee_name" : "Aseem",
        "award_dept" : "Backend",
        "award_region" : "Nevada",
        "awardee_email" : "prashara@gmail.com",
        "awarder_ID" : 5,
        "timestamp" : 12347
    }
]
var dbConnection = db.connect();
for( var i=0; i<2; ++i ){
    dbConnection.query("INSERT INTO emp_award (award_type, awardee_name, awardee_dept, awardee_region, awardee_email, awarder_ID, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)", [body[i]['award_type'], body[i]['awardee_name'], body[i]['award_dept'], body[i]['award_region'], body[i]['awardee_email'], body[i]['awarder_ID'], body[i]['timestamp']], (err) => {
        if(err){
            console.error(err);
        }
    })
}
db.disconnect(dbConnection);*/

router.get('/', (req, res) => {
    if( auth.isAdminLoggedIn(req,res) === 0 ){
        return;
    }
    res.render('plotlyTest', {
        layout: false
    });
})

router.get('/load/:field', (req, res) => {
    if( auth.isAdminLoggedIn(req,res) === 0 ){
        return;
    }
    var SQLparams = [ req.params['field'] ];
    var SQLquery = "SELECT * FROM emp_award";
    var dbConnection = db.connect();
    dbConnection.query(SQLquery, SQLparams, (err, result) => {
        var talliedResults = {};
        for( entry in result ){
            if( talliedResults[ result[entry][req.params['field']] ] === undefined ){
                talliedResults[ result[entry][req.params['field']] ] = 1;
            } else {
                talliedResults[ result[entry][req.params['field']] ] += 1;
            }
        }
        var output = {
            "x" : [],
            "y" : [],
            type : "bar"
        };

        for( key in talliedResults ){
            output['x'].push("-" + key + "-");
            output['y'].push(talliedResults[key]);
        }
        res.send(JSON.stringify([output]));
        db.disconnect(dbConnection);
    })
})


module.exports = router;