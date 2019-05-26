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
    console.log("I am inside user authentication");
    console.log("Checking user type for user.");
    console.log(req.user.user_type);
    console.log("Req authentication:"+ req.isAuthenticated());
    console.log(req.user.user_type == 1);
    if( req.isAuthenticated() && (req.user.user_type == 1)){
        console.log("I am returning 1 for this user.");
        return 1;
    } else {
        req.flash("error","Please login to your user account first");
        res.redirect('/login');
        return 0;
    }
}

authenticate.isAdminLoggedIn = (req, res) => {
    console.log("I am inside admin authentication");
    console.log("Checking user type for admin.");
    console.log(req.user.user_type === undefined);
    if( req.isAuthenticated() && (req.user.user_type === undefined) ){
        console.log("I am returning 1 for this admin.")
        return 1;
    } else {
        req.flash("error","Please login to your admin account first");
        res.redirect('/admin/login');
        return 0;
    }
}

module.exports = authenticate;