var express = require('express');
var router = express.Router();
const db = require ('../db.js');    
const fs = require('fs');


editUserPage: (req, res) => {
        let userId = req.params.id;
        let query = "SELECT * FROM `users` WHERE id = '" + userId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edituser.hbs', {title: 'Edit User',user: result[0],message: ''});
        });
    }
    
    editUser: (req, res) => {
        let userId = req.params.id;
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
       

        let query = "UPDATE `users` SET `first_name` = '" + firstname + "', `last_name` = '" + lastname + "'WHERE `users`.`user_id` = '" + userId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/profile');
        });
    }



module.exports = router;