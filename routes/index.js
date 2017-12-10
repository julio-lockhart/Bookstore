const searchRoute = require('./store/search');
const loginRoute = require('./users/login');
const userRoute = require('./users/user');

const constructorMethod = (app) => {
    app.use("/", searchRoute);
    app.use("/login", loginRoute);
    app.use("/user", userRoute);

    app.use("*", (req, res) => {
        res.render("error/static", {});
    });
};

module.exports = constructorMethod;