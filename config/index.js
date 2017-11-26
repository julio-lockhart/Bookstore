// const path = require('path');
// const express = require('express');
// const exphbs = require('express-handlebars');
// const bodyParser = require('body-parser');
// const passport = require('passport');
// const session = require('express-session');
// const configRoutes = require('../routes');
// const auth = require('./authentication')
// const static = express.static(__dirname + '/../public');
// const app = express();

// const handlebarsInstance = exphbs.create({
//     defaultLayout: 'main',
//     partialsDir: "views/partials/"
// });

// app.use(bodyParser.urlencoded({
//     extended: true
// }));

// // Use application-level middleware for common functionality, including
// // logging, parsing, and session handling.
// app.use(require('cookie-parser')());
// app.use(require('body-parser').urlencoded({
//     extended: true
// }));

// auth.init(app);

// app.use(session({
//     secret: "Lab9",
//     resave: false,
//     saveUninitialized: false
// }));

// app.use("/public", static);

// // Configure view engine to render handlebars templates
// app.engine('handlebars', handlebarsInstance.engine);
// app.set('view engine', 'handlebars');

// // Initialize Passport and restore authentication state, if any, from the
// // session.
// app.use(passport.initialize());
// app.use(passport.session());

// configRoutes(app);

// module.exports = app

const path = require('path');

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const configRoutes = require('../routes');
const auth = require('./authentication');
const static = express.static(__dirname + '/../public');

const app = express();

const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    partialsDir: "views/partials/"
});

app.use(bodyParser.urlencoded({
    extended: false
}));

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

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

configRoutes(app);

module.exports = app