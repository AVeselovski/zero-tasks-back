const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');
const keys = require('./config/keys');
const config = require('./config');

// DB setup
/*
if (process.env.NODE_ENV === 'production') {
    mongoose.connect(config.databaseURL);
} else {
    mongoose.connect(config.databaseURLdev);
}
*/
mongoose.connect(keys.databaseURL);
console.log(process.env.NODE_ENV);

// App setup
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
router(app);
// error handling
app.use(function(error, req, res, next) {
	console.error(error.message);
	res.status(error.status || 500).send(error.message);
});

// server setup
const port = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);
