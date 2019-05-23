const nodemailer = require('nodemailer');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config/secret_info.json'));

function emailer(msg_recipients, msg_subject, msg_html, path_to_attachment){
    var transporter = nodemailer.createTransport({
        host : "mail.engr.oregonstate.edu",
        port : 465,
        secure : true,
        auth : {
            user : config['osu_email']['username'],
            pass : config['osu_email']['password']
        }
    })
    if( path_to_attachment !== undefined ){
        var email = {
            from : "awards@RIGEL-ERP.com",
            to: msg_recipients,
            subject: msg_subject,
            html: msg_html,
            attachments: [
                {
                    path : path_to_attachment
                }
            ]
        }
    } else {
        var email = {
            from : "password-reset@RIGEL-ERP.com",
            to : msg_recipients,
            subect : msg_subject,
            html : msg_html
        }
    }
    transporter.sendMail(email);
}

module.exports = emailer;