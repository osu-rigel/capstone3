const nodemailer = require('nodemailer');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config/secret_info.json'));

function emailer(msg_recipients, msg_subject, msg_html){
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
        to: msg_recipients,
        subject: msg_subject,
        html: msg_html
    })
}

module.exports = emailer;