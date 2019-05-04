var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.render('Login');
})

router.post('/login', passport.authenticate(
    'local_user',{
        successRedirect:'/profile',
        failureRedirect: '/login'
    })
);

router.get('/reset', (req, res) => {
    res.render("Reset");
})

router.get('/create_pass', (req, res) => {
    res.render('CreatePassword');
})

/*
router.get('/reset_pass/:uuid', (req, res) => {
    // some sort of checking mechanism
    res.render('CreatePassword', {
        user_info : user,
    });
})

router.post('/reset', (req,res) => {
    if( isValid(req.body['user'], req.body['secret_answer']) ){
        var resetLink = generateRandomUUID();
        saveUUIDResetToMemory(resetLink);
        sendEmail(userEmail, resetLink);
    }
})
// TODO : more routes for table manipulation

function isValid(){
    //check request submission against database
}*/

module.exports = router;