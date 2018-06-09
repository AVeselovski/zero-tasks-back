const AuthController = require('../controllers/authentication');
const NoteController = require('../controllers/notes');
const passportService = require('../services/passport');
const passport = require('passport');

// authentication middlewares
const requireToken = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.send({ message: 'API is running.' });
	});
	app.post('/register', AuthController.register);
	app.post('/login', requireLogin, AuthController.login);
	// resources
	app.get('/notes', requireToken, NoteController.getNotes);
	app.post('/note', requireToken, NoteController.postNote);
	app.delete('/note/:id', requireToken, NoteController.deleteNote);
	app.put('/note/:id', requireToken, NoteController.putNote);
	app.put('/note/list/:id', requireToken, NoteController.putNoteList);
	app.put('/note/status/:id', requireToken, NoteController.putNoteStatus);
};
