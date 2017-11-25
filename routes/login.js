const express = require('express');
const router = express.Router();
const passport = require('passport');

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

        console.log(req.body);

        if (!user) {
            console.log(info);
        } else {
            console.log("User Login Good");
        }

        // if (!user) {
        //     res.redirect("/");
        // } else {
        //     console.log("User Login Good");
        //     req.session.user = user;
        // }
    })(req, res, next);
});

module.exports = router;