const nodemailer = require('nodemailer');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config/secret_info.json'));

function emailer(){
    var transporter = nodemailer.createTransport({
        host : "mail.engr.oregonstate.edu",
        port : 465,
        secure : true,
        auth : {
            user : config['osu_email']['username'],
            pass : config['osu_email']['password']
        }
    })
    transporter.sendMail({
        from : "ken@capstone.com",
        to: "hallkenn@oregonstate.edu, prashara@oregonstate.edu, anmistry@oregonstate.edu",
        subject: "testing capstone emailer feature",
        html: "<h1>HELLO WORLD</h1>"
    })
}

module.exports = emailer;