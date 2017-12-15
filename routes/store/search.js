const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('../../config/authentication/middleware');
const functions = require('../../utilities/functions');

const data = require('../../data');
const searchAPI = data.search;
const userAPI = data.users;

// Defualt landing page, returns *
router.get("/", async(req, res) => {
    let authData = functions.isUserAuthenticated(req.user);
    let categories = await searchAPI.getCategories();

    await searchAPI.searchForBooks("*")
        .then((result) => {
            res.render("store/landingPage/static", {
                authData: authData,
                pageTitle: "Bookstore",
                categories: categories,
                result: result
            });
        })
        .catch((error) => {
            res.render("error/static", {
                error
            });
        });
});

// Search for a book based on isbn
router.get("/search/isbn/:isbn", async(req, res) => {
    let authData = functions.isUserAuthenticated(req.user);
    let isbn = req.params.isbn;
    if (!isbn) throw {
        "route": "/search/isbn",
        "error:": "ISBN was null"
    };

    await searchAPI.searchByISBN(isbn)
        .then((result) => {
            res.render("store/bookView/static", {
                authData: authData,
                pageTitle: result[0].title,
                result: result[0]
            });
        })
        .catch(error => res.status(500).json({
            error: error
        }));
});

// Search for books based on titles
router.get("/search/:bookTitle", async(req, res) => {
    let authData = functions.isUserAuthenticated(req.user);
    let bookTitle = req.params.bookTitle;
    if (!bookTitle) throw {
        "route": "/search/:bookTitle",
        "error:": "Book title was null"
    };

    let categories = await searchAPI.getCategories();

    await searchAPI.searchForBooks(bookTitle)
        .then((result) => {
            res.render("store/landingPage/static", {
                authData: authData,
                pageTitle: "Search Results: " + bookTitle,
                categories: categories,
                result: result
            });
        })
        .catch(error => res.status(500).json({
            error: error
        }));
});

// Search for books based on category
router.get("/category/:category", async(req, res) => {
    let authData = functions.isUserAuthenticated(req.user);
    let category = req.params.category;
    if (!category) throw {
        "route": "/category/:category",
        "error:": "Category was null"
    };

    let categories = await searchAPI.getCategories();

    await searchAPI.searchByCategory(category)
        .then((result) => {
            res.render("store/landingPage/static", {
                authData: authData,
                pageTitle: "Category: " + category,
                categories: categories,
                result: result
            });
        })
        .catch(error => res.status(500).json({
            error: error
        }));
});

// Post query when user searches for a book title
router.post("/search", async(req, res) => {
    let bookTitle = req.body.bookTitle;

    if (bookTitle) {
        res.redirect("/search/" + bookTitle);
    } else {
        res.end(); // Don't do anything
    }
});

// Post query when user adds a book to their cart
router.post("/addToCart/:isbn", authenticationMiddleware, async(req, res, next) => {
    let isbn = req.params.isbn;
    let user = req.user;

    let book = await searchAPI.searchByISBN(isbn);
    let updateStatus = await userAPI.addToCart(user.email, book);

    // Redirect back to the main page and show that adding to cart was successful
    if (updateStatus) {
        res.redirect("/user/shoppingCart");
    }
});

module.exports = router;