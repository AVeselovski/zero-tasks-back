const passport = require('passport');
const UserModel = require('../models/user');
const keys = require('../config/keys');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// setup options for local Strategy, by default looks for 'username' field
const localOptions = {
	usernameField: 'email'
};

const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
	// verify this email and password,
	// call 'done' with that user if correct credentials
	UserModel.findOne({ email: email }, function(error, user) {
		if (error) {
			return done(error);
		}
		if (!user) {
			return done(null, false);
		}

		// compare passwords
		user.comparePassword(password, function(error, isMatch) {
			if (error) {
				return done(error);
			}
			if (!isMatch) {
				return done(null, false);
			}

			return done(null, user);
		});
	});
});

// setup options for JWT Strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromHeader('authorization'),
	secretOrKey: keys.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
	// if valid token, call done with user id extracted from token
	done(null, payload.sub);

	// disabled
	// extra step checking the db if user exists, before calling done
	/*
     *
     * UserModel.findById(payload.sub, function(error, user) {
     *    if (error) { return done(error, false); }
     *
     *    if (user) {
     *        done(null, user.id);
     *    } else {
     *        done(null, false);
     *    }
     * });
     * 
     */
});

passport.use(jwtLogin);
passport.use(localLogin);
