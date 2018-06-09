const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const NoteSchema = require('./schemas/note');

const UserSchema = new Schema({
	email: {
		type: String,
		unique: true,
		lowercase: true
	},
	password: String,
	notes: [NoteSchema]
});

// on save hook, encrypt password before saving a model
UserSchema.pre('save', function(next) {
	// get access to the user model instance
	const user = this;
	// generate a salt then callback
	bcrypt.genSalt(10, function(error, salt) {
		if (error) {
			return next(error);
		}
		// hash password using salt
		bcrypt.hash(user.password, salt, null, function(error, hash) {
			if (error) {
				return next(error);
			}
			// overwrite plain text password with encrypted password
			user.password = hash;
			next();
		});
	});
});

// compare passwords
UserSchema.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function(error, isMatch) {
		if (error) {
			return callback(error);
		}

		callback(null, isMatch);
	});
};

// create the model class
const Model = mongoose.model('user', UserSchema);
module.exports = Model;
