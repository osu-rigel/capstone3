const sqlite3 = require('sqlite3');

function database_access(){
    var db = new sqlite3.Database('./database', sqlite3.OPEN_READWRITE, (err) => {
        if(err){
            console.error(err);
        } else {
            console.log("In-memory SQLite database initialized");
        }
    });

    // http://www.sqlitetutorial.net/sqlite-nodejs/connect/
    // TODO: DATABASE STUFF!

    db.close( (err) => {
        if(err){
            console.error(err);
        }
        console.log("Database connection closed");
    })
}

module.exports = database_access;