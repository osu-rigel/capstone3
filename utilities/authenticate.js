authenticate = {};

authenticate.isAuth = (req, res) => {
    console.log(req.session);
    if( req.session.isAuthenticated === undefined ){
        res.redirect('/login');
        return 0;
    } else {
        return 1;
    }
}

authenticate.checkCredentials = (req,res) => {
    // check for username + password in the database

    // if username + password not in database, send back to login with error message

    // if in database, reroute appropriately based on whether is user/admin

    // set req.session.isAuthenticated to true
}
module.exports = authenticate;