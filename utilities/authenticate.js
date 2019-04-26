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

authenticate.isLoggedIn = (req, res) => {
    if( req.isAuthenticated() ){ 
        return 1;
    } else {
        res.redirect('/login');
        return 0;
    }
}

authenticate.isAdminLoggedIn = (req, res) => {
    if( req.isAuthenticated() ){
        return 1;
    } else {
        res.redirect('/adminlogin');
        return 0;
    }
}

module.exports = authenticate;