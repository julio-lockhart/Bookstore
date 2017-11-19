const searchRoute = require('./search');
const registerRoute = require('./registration');

const constructorMethod = (app) => {
    app.use("/", searchRoute);
    app.use("/register", registerRoute);

    app.use("*", (req, res) => {
        res.redirect("/");
    })
};

module.exports = constructorMethod;