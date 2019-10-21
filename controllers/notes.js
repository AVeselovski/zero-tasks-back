const UserModel = require('../models/user');

// get all notes
exports.getNotes = function(req, res, next) {
	const userId = req.user;

	UserModel.findById(userId, function(error, response) {
		if (error) {
			return next(error);
		}
		
		const notes = response.notes.sort(function(a, b) {
			return b.createdAt - a.createdAt;
		});
		res.status(200).send(notes);
	});
};

// get by id
exports.getNote = function(req, res, next) {
	const userId = req.user;

	UserModel.find(
        { _id: userId, "notes._id": req.params.id },
        { 'notes.$': 1 },
        function (error, response) {
            if (error) {
				error.status = 404;
                return next(error);
			}
			
			const note = response[0] ? response[0].notes[0] : null;
			if (!note) {
				let error = new Error();
				error.status = 404;
				error.message = 'Resource not found.'

				return next(error);
			}
			
            res.status(200).send(note);
        }
    );
}

// adding new note
exports.postNote = function(req, res, next) {
	const userId = req.user;
	const note = {
		...req.body,
		createdAt: Date.now(),
		updatedAt: Date.now()
	};

	UserModel.findByIdAndUpdate(
		{ _id: userId },
		{
			$push: {
				notes: note
			}
		},
		function(error, response) {
			if (error) {
				return next(error);
			}
			res.status(200).send({ message: 'Resource created succesfully.' });
		}
	);
};

// deleting notes
exports.deleteNote = function(req, res, next) {
	const userId = req.user;
	const noteId = req.params.id;

	UserModel.findByIdAndUpdate(
		{ _id: userId },
		{
			$pull: {
				notes: { _id: noteId }
			}
		},
		function(error, response) {
			if (error) {
				return next(error);
			}
			res.status(200).send({ message: 'Resource removed succesfully.' });
		}
	);
};

// updating notes
exports.putNote = function(req, res, next) {
	const userId = req.user;
	const noteId = req.params.id;

	if (!req.body.title && !req.body.description) {
		const error = new Error('Invalid submission. Title or description must be provided.');
		return next(error);
	}

	const updatedNote = {
		'notes.$.title': req.body.title || null,
		'notes.$.description': req.body.description || null,
		'notes.$.list': req.body.list || null,
		'notes.$.tag': req.body.tag || null,
		'notes.$.priority': req.body.priority || 0,
		'notes.$.status': req.body.status || 'active',
		'notes.$.dueDate': req.body.dueDate || null,
		'notes.$.createdAt': req.body.createdAt,
		'notes.$.updatedAt': Date.now()
	};

	UserModel.update({ _id: userId, 'notes._id': noteId }, updatedNote, function(error, response) {
		if (error) {
			return next(error);
		}
		res.status(200).send({ message: 'Resource updated succesfully.' });
	});
};

// checking list-items update
exports.putNoteList = function(req, res, next) {
	const userId = req.user;
	const noteId = req.params.id;
	const updatedList = req.body.list;

	UserModel.update(
		{ _id: userId, 'notes._id': noteId },
		{
			$set: { 'notes.$.list': updatedList, 'notes.$.updatedAt': Date.now() }
		},
		function(error, response) {
			if (error) {
				return next(error);
			}
			res.status(200).send({ message: 'Resource updated succesfully.' });
		}
	);
};

exports.putNoteStatus = function(req, res, next) {
	const userId = req.user;
	const noteId = req.params.id;
	const updatedStatus = req.body.status;

	UserModel.update(
		{ _id: userId, 'notes._id': noteId },
		{
			$set: { 'notes.$.status': updatedStatus, 'notes.$.updatedAt': Date.now() }
		},
		function(error, response) {
			if (error) {
				return next(error);
			}
			res.status(200).send({ message: 'Resource updated succesfully.' });
		}
	);
};

// NOTE TO SELF! To update specific fields in a document, use DOT NOTATION as above.
// Supplying an object instead will overwrite the document with the object (_id too).
