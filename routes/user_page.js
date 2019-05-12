var express = require('express');
var router = express.Router();
const auth = require('../utilities/authenticate.js');
const db = require ('../utilities/db.js')
//var mysql = require('mysql');

/*var connection = mysql.createConnection({
        host     : 'remotemysql.com',
        port     :  3306,
        user     : 'ShTfB8icwf',
        password : 'ObcoP11fFs',
        database : 'ShTfB8icwf',
});
*/

router.get('/', (req, res) => {
    if( auth.isLoggedIn(req, res) === 0 ){
        return;
    }    
    return res.render('user_page');
})

router.post('/', (request, res) => {
    var username = request.body.Username;
    var password = request.body.Password;
    console.log(username + ":" + password);

    console.log("calling POST method of user_page.js");

    var connection = db.connect();
    /*connection.connect(function(err) {
        if (err) {
            console.log('error connecting: ' + err.stack);
        return;
        }
 
        console.log('connected as id ' + connection.threadId);
    });*/

    connection.query('SELECT * from emp_award', function(error, results, fields) {
    if (error) throw error;
        console.log('The query data is: ', results);
        res.render('user_page', {elements: results});
    }); 
    db.disconnect(connection);

})

// TODO : more get/post routes for user table manipulations

module.exports = router;