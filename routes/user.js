const express = require('express');
const router = express.Router();
const data = require('../data');
const lodash = require('lodash');

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
        // Get the number of items plus the total amount of the user's shopping cart
        let numOfItems = 0;
        let totalAmount = 0;

        lodash.forEach(user.shoppingCart, function (book) {
            numOfItems += book.quantity;
            totalAmount += (book.quantity * book.price);
        });

        res.render("user/shoppingCart", {
            numOfItems,
            totalAmount,
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