const authenticationMiddleware = (req, res, next) => {
    // 
    if (req.isAuthenticated()) {
        //if user is loged in, req.isAuthenticated() will return true 
        next();
    } else {
        res.redirect("/login");
    }
};

module.exports = authenticationMiddleware;