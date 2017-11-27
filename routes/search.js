const express = require('express');
const router = express.Router();
const axios = require('axios');

const functions = require('../utilities/functions')
const data = require('../data');
const searchAPI = data.search;
const userAPI = data.users;

router.get("/", async(req, res) => {
    let authData = functions.isUserAuthenticated(req.user);

    await searchAPI.searchForBooks("*")
        .then((result) => {
            res.render("landingPage/static", {
                authData,
                result
            });
        })
        .catch(error => res.status(500).json({
            "error": error
        }));
});

router.post("/search", async(req, res) => {
    let bookTitle = req.body.bookTitle;

    if (bookTitle) {
        res.redirect("/search/" + bookTitle);
    } else {
        res.end(); // Don't do anything
    }
});

router.get("/search/isbn/:isbn", async(req, res) => {
    let authData = functions.isUserAuthenticated(req.user);
    let isbn = req.params.isbn;

    if (!isbn) throw "ISBN was null";

    await searchAPI.searchByISBN(isbn)
        .then((result) => {
            res.render("bookView/static", {
                title: result.title,
                author: result.authors,
                description: result.description,
                isbn: result.isbn,
                imageURL: result.imageURL.replace("zoom=1", "zoom=2"),
                publisher: result.publisher,
                publishedDate: result.publishedDate,
                pageCount: result.pageCount,
                price: result.price,
                categories: result.categories,
                averageRating: result.averageRating,
                ratingsCount: result.ratingsCount,
                authData
            });
        })
        .catch(error => res.status(500).json({
            "error": error
        }));
});

router.get("/search/:bookTitle", async(req, res) => {
    let authData = functions.isUserAuthenticated(req.user);
    let bookTitle = req.params.bookTitle;
    if (!bookTitle) throw "Book title was null";

    await searchAPI.searchForBooks(bookTitle)
        .then(result => {
            res.render("landingPage/static", {
                authData,
                result
            });
        })
        .catch(error => res.status(500).json({
            "error": error
        }));
});

router.get("/category/:category", async(req, res) => {
    let authData = functions.isUserAuthenticated(req.user);

    await searchAPI.searchByCategory(req.params.category)
        .then(result => res.json(result))
        .catch(error => res.status(500).json({
            "error": error
        }));
});

router.post("/addToCart/:isbn", async(req, res, next) => {
    let isbn = req.params.isbn;
    let user = req.user;

    try {
        if (user != null) {
            let book = await searchAPI.searchByISBN(isbn);
            let updateStatus = await userAPI.addToCart(user.email, book);
            console.log("Update Status: " + updateStatus);

            // Redirect back to the main page and show that adding to cart was successful
            if (updateStatus) {
                res.redirect("/user/shoppingCart");
            }
        }
    } catch (e) {
        next(e);
    }
});

module.exports = router;