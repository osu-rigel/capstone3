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
    var connection = db.connect();
    var name = req.user.firstname;
    var id = req.user.user_id;
    console.log("IN profile page user id and name are: ");
    console.log(name+" "+id);
    
    connection.query('SELECT award_id, award_type, awardee_email, awardee_dept, awardee_region FROM emp_award WHERE awarder_ID = ?', [req.user['user_id']], function(error, results, fields) {
    if (error) throw error;
        console.log('The query data is: ', results);
        res.render('user_page', {
            elements: results,
            name: name,
            id: id,
            layout: false
        });
        
    }); 
    db.disconnect(connection); 
})

// TODO : more get/post routes for user table manipulations

module.exports = router;