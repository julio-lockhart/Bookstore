const searchRoute = require('./search');
const registerRoute = require('./registration');
const loginRoute = require('./login');
const userRoute = require('./user');

const constructorMethod = (app) => {
    app.use("/", searchRoute);
    app.use("/register", registerRoute);
    app.use("/login", loginRoute);
    app.use("/user", userRoute);

    app.use("*", (req, res) => {
        res.redirect("/");
    })
};

module.exports = constructorMethod;