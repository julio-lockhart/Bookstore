const passport = require('passport');
const bcrypt = require('bcrypt-nodejs');
const LocalStrategy = require('passport-local').Strategy;
const PassportLocalStrategy = require('passport-local');

const authenticationMiddleware = require('./middleware');
let data = require('../../data/');

// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
let initializePassport = () => {
    passport.use(new LocalStrategy(
        function (username, password, callback) {
            data.users.findByEmail(username, function (err, user) {
                if (err) {
                    return callback(err);
                }

                if (!user) {
                    console.log('User not found');
                    return callback(null, false);
                }

                // Check if the password entered by the user matches the hashed password
                bcrypt.compare(password, user.password, function (err, isValid) {
                    if (err) {
                        return callback(err);
                    }

                    if (!isValid) {
                        return callback(null, false);
                    }

                    return callback(null, user);
                });
            });
        }
    ))

    passport.authenticationMiddleware = authenticationMiddleware;
};


passport.serializeUser(function (user, done) {
    done(null, user.email);
});

passport.deserializeUser(function (username, cb) {
    data.users.findByEmail(username, function (err, user) {
        if (err) {
            return cb(err);
        }
        cb(null, user);
    });
});

module.exports = initializePassport;