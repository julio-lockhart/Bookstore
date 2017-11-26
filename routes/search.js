const express = require('express');
const router = express.Router();
const axios = require('axios');

const data = require('../data');
const searchAPI = data.search;

router.get("/", async(req, res) => {

    let isUserAuthenticated = (req.user != null) ? true : false;

    await searchAPI.searchForBooks("*")
        .then((result) => {
            res.render("landingPage/static", {
                isUserAuthenticated: isUserAuthenticated,
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
    let isbn = req.params.isbn;

    if (!isbn) throw "ISBN was null";

    await searchAPI.searchByISBN(isbn)
        .then((result) => {
            res.render("bookView/static", {
                title: result.title,
                author: result.authors,
                description: result.description,
                imageURL: result.imageURL.replace("zoom=1", "zoom=2"),
                publisher: result.publisher,
                publishedDate: result.publishedDate,
                pageCount: result.pageCount,
                price: result.price,
                categories: result.categories,
                averageRating: result.averageRating,
                ratingsCount: result.ratingsCount
            });
        })
        .catch(error => res.status(500).json({
            "error": error
        }));
});

router.get("/search/:bookTitle", async(req, res) => {
    let bookTitle = req.params.bookTitle;
    if (!bookTitle) throw "Book title was null";

    await searchAPI.searchForBooks(bookTitle)
        .then(result => {
            res.render("landingPage/static", {
                result
            });
        })
        .catch(error => res.status(500).json({
            "error": error
        }));
});

router.get("/category/:category", async(req, res) => {
    await searchAPI.searchByCategory(req.params.category)
        .then(result => res.json(result))
        .catch(error => res.status(500).json({
            "error": error
        }));
});

module.exports = router;