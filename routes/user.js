const express = require('express');
const router = express.Router();
const lodash = require('lodash');

const data = require('../data');
const userAPI = data.users;

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
            numOfItems += Number(book.quantity);
            totalAmount += (book.quantity * book.price);
        });

        res.render("user/shoppingCart", {
            numOfItems,
            totalAmount,
            cart: user.shoppingCart
        });
    }
});

router.post("/shoppingCart/update/:isbn", async(req, res, next) => {
    let user = req.user;
    let isbn = req.params.isbn;
    let updateQuantity = req.body.quantity;

    if ('remove' in req.body) {
        let status = await userAPI.removeBookFromCart(user, isbn);
        if (status.result.ok === 1) {
            console.log("Removal was good");
            res.redirect("/user/shoppingcart");
        }

    } else if ('update' in req.body) {
        let status = await userAPI.updateQuantity(user, isbn, updateQuantity);
        if (status.result.ok === 1) {
            console.log("Update was good");
            res.redirect("/user/shoppingcart");
        }
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