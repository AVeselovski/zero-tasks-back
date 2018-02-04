const authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// authentication middlewares
const requireToken = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.send({ message: 'Note Keep API.' });
    });
    app.post('/register', authentication.register);
    app.post('/login', requireLogin, authentication.login);
    // resources
    app.get('/resources', requireToken, function(req, res) {
        res.send({ message: 'This is protected route!' });
    });
}
