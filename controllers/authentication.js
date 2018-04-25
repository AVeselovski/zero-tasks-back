const jwt = require('jwt-simple');
const UserModel = require('../models/user');
// config file must be created first in project root
const config = require('../config');

function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

// login controller
exports.login = function (req, res, next) {
    // user authorized with passport's 'local' strategy middleware
    // user model instance supplied by passport's 'done' call
    res.json({ token: tokenForUser(req.user) }); // TODO: add user data to res object to populate client on login
}

// register controller
exports.register = function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        return res.status(422).send({
            error: 'Email and password must be provided!'
        });
    }

    // check if user exists
    UserModel.findOne({ email: email }, function (error, existingUser) {
        if (error) { return next(error); }

        // if exists, return an error
        if (existingUser) {
            return res.status(422).send({ error: 'Email is already in use!' });
        }

        // if not, create and save user record
        const user = new UserModel({
            email: email,
            password: password
        });

        user.save(function (error) {
            if (error) { return next(error); }

            // respond to request with token
            res.json({ token: tokenForUser(user) }); // TODO: add user data to res object to init client on login
        });
    });
}
