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
                error: "An account with that email does not exist."
            })
        } else {
            if (user) {
                req.logIn(user, function (err) {
                    if (err) {
                        return next(err);
                    }

                    res.redirect("user/account");
                });
            } else {
                res.render("user/loginView/login", {
                    error: "Incorrect password."
                })
            }
        }
    })(req, res, next);
});

module.exports = router;