const searchRoute = require('./search');

const constructorMethod = (app) => {
    app.use("/", searchRoute);

    app.use("*", (req, res) => {
        res.redirect("/");
    })
};

module.exports = constructorMethod;