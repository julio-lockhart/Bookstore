const express = require('express');
const router = express.Router();
const data = require('../data');
const usersAPI = data.users;

router.get("/", (req, res) => {
    res.render("registration/register", {});
});

router.post("/", async(req, res) => {
    let data = req.body;
    console.log(data);

    await usersAPI.getUserByEmail(data.emailInput)
        .then(result => {
            if (!result) {
                usersAPI.insertNewUser(data)
                    .then(insertResult => {
                        console.log(insertResult);
                    })
                    .catch(error => console.log(error));
            }
        })
        .catch(error => {
            console.log(error);
        });
});

module.exports = router;