const express = require('express');
const router = express.Router();
const axios = require('axios');

const data = require('../data');
const searchAPI = data.search;

router.get("/", async(req, res) => {
    await searchAPI.searchForBooks("*")
        .then((result) => {
            res.render("landingPage/static", {
                result
            });
        })
        .catch(error => res.status(500).json({
            "error": error
        }));
});

router.get("/search/:bookTitle", async(req, res) => {
    await searchAPI.searchForBooks(req.params.bookTitle)
        .then(result => res.json(result))
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