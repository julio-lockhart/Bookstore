const express = require('express');
const router = express.Router();
const data = require('../data');

router.get("/account", (req, res) => {
    let user = req.user;

    if (!user) {
        res.redirect("/login");
    } else {
        res.render("user/account", {
            user
        });
    }
});

router.get("/shoppingCart", (req, res) => {
    let user = req.user;

    if (!user) {
        res.redirect("/login");
    } else {
        res.render("user/shoppingCart", {
            cart: user.shoppingCart
        });
    }
});

router.get("/purchases", (req, res) => {
    let user = req.user;

    if (!user) {
        res.redirect("/login");
    } else {
        res.render("user/purchases", {
            purchases: user.purchases
        });
    }
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}