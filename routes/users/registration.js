const express = require('express');
const router = express.Router();
const passport = require('passport');
const data = require('../../data');
const usersAPI = data.users;

router.get("/", (req, res) => {
    res.render("user/registrationView/register", {});
});

router.post("/", async(req, res) => {
    let data = req.body;

    await usersAPI.findByEmail(data.emailInput, function (err, user) {
        if (user) {
            res.render("user/registrationView/register", {
                error: "An account with that email already exists."
            });
        } else {
            usersAPI.insertNewUser(data)
                .then(user => {
                    if (user) {
                        req.logIn(user, function (err) {
                            if (err) {
                                return next(err);
                            }

                            res.redirect("/");
                        });
                    }
                })
                .catch(error => {
                    res.render("error/static", {
                        error
                    });
                });
        }
    });
});

module.exports = router;