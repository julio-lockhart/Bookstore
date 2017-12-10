const express = require('express');
const session = require('express-session');
const passport = require('passport');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const auth = require('./authentication');
const static = express.static(__dirname + '/../public');
const configRoutes = require('../routes');

const app = express();

const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    partialsDir: "views/partials/"
});

auth.init(app);

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: "bookstore",
    resave: false,
    saveUninitialized: false
}));

// Configure view engine to render handlebars templates
app.use("/public", static);
app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

// Morgan logger
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
//app.use(morganDebug('myapp', 'combined'));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

configRoutes(app);

module.exports = app