var mysql = require('mysql');

functions = {};

functions.connect = () => {
  var connection = mysql.createConnection({
    host     : 'remotemysql.com',
    port     :  3306,
    user     : 'ShTfB8icwf',
    password : 'ObcoP11fFs',
    database : 'ShTfB8icwf',
  });
  connection.connect();
  return connection;
}

functions.disconnect = (connection) => {
  connection.end();
}
module.exports = functions;