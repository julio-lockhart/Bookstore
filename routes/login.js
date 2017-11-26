const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenticationMiddleware = require('../config/authentication')
let Strategy = require('passport-local').Strategy;

router.get("/", (req, res) => {
    res.render("registration/login", {});
});

router.post("/", (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            res.sendStatus(500).json({
                error: err
            });
        }

        if (!user) {
            console.log(info);
        } else {
            console.log("User Login Good");

            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }

                console.log("Log In Good");
                console.log(req.user);
                res.redirect("/");
            });
        }
    })(req, res, next);
});



module.exports = router;