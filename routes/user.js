const express = require('express');
const router = express.Router();
const data = require('../data');

router.get("/account", (req, res) => {
    let user = req.user;

    if (!user) {
        res.redirect("/login");
    } else {
        res.render("userInfo/account", {
            user
        });
    }
});

router.get("/shoppingCart", (req, res) => {
    let user = req.user;

    if (!user) {
        res.redirect("/login");
    } else {
        res.render("userInfo/shoppingCart", {
            cart: user.shoppingCart
        });
    }
});

router.get("/purchases", (req, res) => {
    let user = req.user;

    if (!user) {
        res.redirect("/login");
    } else {
        res.render("userInfo/purchases", {
            purchases: user.purchases
        });
    }
});

module.exports = router;