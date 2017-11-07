const express = require('express');
const router = express.Router();
const axios = require('axios');

const data = require('../data');
const searchAPI = data.search;

router.get("/", async(req, res) => {

    await searchAPI.searchForBooks("*")
        .then(result => res.json(result))
        .catch(error => res.status(500).json({
            "error": "Error: " + error
        }));
});

router.get("/search/:bookTitle", (req, res) => {
    res.sendStatus(200);
});

module.exports = router;