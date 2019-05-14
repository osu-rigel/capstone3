var express = require('express');
var router = express.Router();
const emailer = require('../utilities/emailer.js');
const auth = require('../utilities/authenticate.js');
const latex = require('node-latex');
const fs = require('fs');

router.get('/', (req, res) => {
    if( auth.isLoggedIn(req,res) === 0 ){
        return;
    }
    var input = fs.readFileSync("./utilities/input.tex", "utf8");
    input = input.replace('AWARD', 'Employee of the Month');
    input = input.replace('DATE', 'RIGHT NOW');
    input = input.replace('SIGNATURE', 'KENNETH W HALL III');
    var pdf = latex(input);
    var output = fs.createWriteStream('./utilities/PDFs/output.pdf');
    pdf.pipe(output);
    pdf.on('finish', () => {
        emailer("hallkenn@oregonstate.edu", "CAPSTONE EMAIL TEST", "<h1>HELLO WORLD</h1>", './utilities/PDFs/output.pdf');
        res.sendStatus(200);    
    })
})


module.exports = router;