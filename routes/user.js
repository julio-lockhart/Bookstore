const express = require('express');
const router = express.Router();
const data = require('../data');

router.get("/account", (req, res) => {
    let user = req.user;

    if (!user) {
        res.redirect("/login");
    } else {
        res.json(user);
    }
});

router.get("/shoppingCart", (req, res) => {
    let user = req.user;

    if (!user) {
        res.redirect("/login");
    } else {
        res.json(user.shoppingCart);
    }
});

router.get("/purchases", (req, res) => {
    let user = req.user;

    if (!user) {
        res.redirect("/login");
    } else {
        res.json(user.purchases);
    }
});

module.exports = router;