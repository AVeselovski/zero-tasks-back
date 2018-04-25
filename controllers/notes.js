const UserModel = require('../models/user');

// get all notes
exports.getNotes = function (req, res, next) {
    const userId = req.user;

    UserModel.findById(
        userId,
        function (error, response) {
            if (error) { return next(error); }
            const notes = response.notes.sort(function(a, b) {return b.priority - a.priority});
            res.status(200).send(notes);
        }
    )
}

// adding new notes
exports.postNote = function (req, res, next) {
    const userId = req.user;
    const note = {
        ...req.body,
        createdAt: Date.now(),
        updatedAt: Date.now()
    }

    UserModel.findByIdAndUpdate(
        { _id: userId },
        {
            $push: {
                notes: note
            }
        },
        function (error, response) {
            if (error) { return next(error); }
            res.status(200).send({ message: 'Resource created succesfully.' });
        }
    );
}

// deleting notes
exports.deleteNote = function (req, res, next) {
    const userId = req.user;
    const noteId = req.params.id;

    UserModel.findByIdAndUpdate(
        { _id: userId },
        {
            $pull: {
                notes: { _id: noteId }
            }
        },
        function (error, response) {
            if (error) { return next(error); }
            res.status(200).send({ message: 'Resource removed succesfully.' });
        }
    )
}

// updating notes
exports.putNote = function (req, res, next) {
    const userId = req.user;
    const noteId = req.params.id;
    const note = {
        ...req.body,
        updatedAt: Date.now()
    }

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
        'notes.$.updatedAt': Date.now(),
    }

    UserModel.update(
        { _id: userId, 'notes._id': noteId },
        updatedNote,
        function (error, response) {
            if (error) { return next(error); }
            res.status(200).send({ message: 'Resource updated succesfully.' });
        }
    )
}

// checking list-items update
// NEEDS FURTHER RESEARCH IF AT ALL USEFUL, what would be
exports.putNoteList = function (req, res, next) {
    const userId = req.user;
    const noteId = req.params.id;
    const updatedList = req.body;

    UserModel.update(
        { _id: userId, 'notes._id': noteId },
        {
            $set: { 'notes.$.list': updatedList, 'notes.$.updatedAt': Date.now() }
        },
        function (error, response) {
            if (error) { return next(error); }
            res.status(200).send({ message: 'Resource updated succesfully.' });
        }
    )
}

exports.putNoteStatus = function (req, res, next) {
    const userId = req.user;
    const noteId = req.params.id;
    const updatedStatus = req.body.status;

    UserModel.update(
        { _id: userId, 'notes._id': noteId },
        {
            $set: { 'notes.$.status': updatedStatus, 'notes.$.updatedAt': Date.now() }
        },
        function (error, response) {
            if (error) { return next(error); }
            res.status(200).send({ message: 'Resource updated succesfully.' });
        }
    )
}

// NOTE TO SELF! To update specific fields in a document, use DOT NOTATION as below.
// Supplying an object instead will overwrite the document with the obvject (_id too).
