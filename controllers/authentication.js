const jwt = require('jwt-simple');
const UserModel = require('../models/user');
// config file must be created first in project root
const keys = require('../config/keys');
const config = require('../config');

function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, keys.secret);
}

// login controller
exports.login = function(req, res, next) {
	// user authorized with passport's 'local' strategy middleware
	// user instance supplied by passport's 'done' call
	res.json({ token: tokenForUser(req.user) });
};

// register controller
exports.register = function(req, res, next) {
	const email = req.body.email;
	const password = req.body.password;

	if (!email || !password) {
		const error = new Error('Email and password must be provided.');
		error.status = 422;
		return next(error);
	}

	const mailValidate = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if (!email.match(mailValidate)) {
		const error = new Error('Valid email must be provided.');
		error.status = 422;
		return next(error);
	}

	// check if user exists
	UserModel.findOne({ email: email }, function(error, existingUser) {
		if (error) {
			return next(error);
		}

		// if exists, return an error
		if (existingUser) {
			const error = new Error('Email is already in use.');
			error.status = 422;
			return next(error);
		}

		// if not, create and save user record
		const user = new UserModel({
			email: email,
			password: password
		});

		user.save(function(error) {
			if (error) {
				return next(error);
			}

			// respond to request with token
			res.json({ token: tokenForUser(user) });
		});
	});
};
