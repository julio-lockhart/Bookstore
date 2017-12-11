const express = require('express');
const router = express.Router();
const passport = require('passport');
const authenticationMiddleware = require('../../config/authentication')
let Strategy = require('passport-local').Strategy;

router.get("/", (req, res) => {
    res.render("user/loginView/login", {});
});

router.post("/", (req, res, next) => {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            res.render("user/loginView/login", {
                error: "There was a problem with the login credentials."
            })
        } else {
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }

                res.redirect("user/account");
            });
        }
    })(req, res, next);
});

module.exports = router;