const searchRoute = require('./store/search');
const loginRoute = require('./users/login');
const registerRoute = require('./users/registration');
const userRoute = require('./users/user');

const constructorMethod = (app) => {
    app.use("/", searchRoute);
    app.use("/login", loginRoute);
    app.use("/user", userRoute);
    app.use("/register", registerRoute);

    app.use("*", (req, res) => {
        res.render("error/static", {
            error: "Page not found."
        });
    });
};

module.exports = constructorMethod;