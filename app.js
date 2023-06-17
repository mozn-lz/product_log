const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// const cors = require('cors');
const passport = require('passport');
require('dotenv').config({path: './.env'});

const sequelize = require('./config/database');

const app = express();
const port = 8080;

// route path `
const defaultRouter = require('./routes/default');
const adminRouter = require('./routes/admin');
// const stuffRouter = require('./routes/stuff');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')))

// middlewear
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({extended: true}));

app.use(passport.initialize());

// route url
app.use('/', defaultRouter);
app.use('/', adminRouter);
// app.use('/', stuffRouter);

app.get('*', (req, res) => {
	// res.sendFile(__dirname + '/public/error/html.html') 
	res.render('error', {title: 'Error ', error_message :'<h1> Invalid URL</h1> <p>The page youare looing for des ot exist or has been deleted</p>'})
});
// app.listen(port, () => { console.log(`Server listening on port: ${port}`)})
app.listen(port, () => {
	console.log(`Server listening on: localhost:${port}`);
});

module.exports = app;
