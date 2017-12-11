const express = require('express');
const router = express.Router();
const lodash = require('lodash');

const functions = require('../../utilities/functions')
const authenticationMiddleware = require('../../config/authentication/middleware');
const data = require('../../data');
const userAPI = data.users;

// Gets the users account information
router.get("/account", authenticationMiddleware, (req, res) => {
    let authData = functions.isUserAuthenticated(req.user);
    let user = req.user;

    res.render("user/accountView/account", {
        authData: authData,
        user: user
    });
});

// Gets the users shopping cart
router.get("/shoppingCart", authenticationMiddleware, (req, res) => {
    let user = req.user;
    let authData = functions.isUserAuthenticated(user);

    // Get the number of items plus the total amount of the user's shopping cart
    let numOfItems = 0;
    let totalAmount = 0;

    lodash.forEach(user.shoppingCart, function (item) {
        numOfItems += Number(item.book.quantity);
        totalAmount += (item.book.quantity * item.book.price);
    });

    res.render("user/accountView/shoppingCart", {
        authData: authData,
        numOfItems: numOfItems,
        totalAmount: totalAmount,
        cart: user.shoppingCart
    });
});

// Gets the users shopping cart
router.get("/purchases", authenticationMiddleware, (req, res) => {
    let authData = functions.isUserAuthenticated(req.user);
    let user = req.user;

    res.render("user/accountView/purchases", {
        authData: authData,
        purchases: user.purchases
    });
});

router.get("/confirmation", authenticationMiddleware, async(req, res) => {
    let authData = functions.isUserAuthenticated(req.user);
    let user = req.user;

    let cartDetails = await userAPI.getCartInformation(user);
    let purchaseConfirmation = await userAPI.completePurchaseOrder(user);

    res.render("user/accountView/purchaseConfirmation", {
        authData: authData,
        totalAmount: cartDetails.totalAmount,
        cart: cartDetails.cart
    });
});

router.post("/account", authenticationMiddleware, async(req, res) => {
    let data = req.body;
    let user = req.user;

    let updatedInfo = await userAPI.updateUser(user._id, data);

    // Re-authenticate log-in incase the user updates their email or password 
    req.logIn(updatedInfo, function (err) {
        if (err) {
            res.render("user/accountView/account", {
                error: "There was a problem updating your account"
            });
        }

        res.redirect("account");
    });
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

module.exports = router;