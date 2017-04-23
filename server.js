const express = require('express');

const app = express();

const jwt = require('jsonwebtoken'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	knexConfig = require('./knexfile'),
	knex = require('knex')(knexConfig),
	UserModel = require('./models/user'),
	User = new UserModel(knex),
	dotenv = require('dotenv');

dotenv.config();

/****************************************************
* Constants
****************************************************/
const JWT_COOKIE_NAME = 'AUTH_TOKEN';
const THIRTY_MINUTES = 30 * 60 * 1000;

/****************************************************
* Middlewares + Configuration
****************************************************/
app.set('view engine', 'pug');
app.set('views', 'views');

app.use(morgan('dev'));

// Parse body from form-based POST requests
app.use(bodyParser.urlencoded({ extended: false }));

// Attach cookies to request objects
app.use(cookieParser());

/****************************************************
* Functions
****************************************************/
function handleError(err, res) {
	console.log('err = ', err.stack);
	res.status(500).send('error');
}

function login(req, res, next) {
	const { username, password } = req.body;

	User.findByCredentials(username, password)
		.then( ( [ userData ] ) => {
			if (userData !== undefined || userData !== null) {
				const token = jwt.sign(userData, process.env.JWT_SECRET);
				
				// Attach the user to the request object 
				req.user = userData;

				// Set the JWT cookie on the response
				res.cookie(JWT_COOKIE_NAME, token, {
					maxAge: THIRTY_MINUTES,
					httpOnly: true,
				});

				// Apply the next route handler
				return next();
			}
			else {
				res.status(400).send('error');
			}
		})
		.catch(err => {
			handleError(err, res);
		});
}

function isAuthorized(req, res, next) {
	const token = req.cookies[JWT_COOKIE_NAME];
	let userPayload;

	try {
		userPayload = jwt.verify(
			token,
			process.env.JWT_SECRET,
			{ maxAge: THIRTY_MINUTES }
		);
	} catch(err) {
		handleError(err, res);
	}

	// Set the user
	req.user = userPayload;

	next();
}

/****************************************************
* Routes
****************************************************/

app.get('/', (req, res) => {
	res.status(200).render('index');
});

app.get('/main', isAuthorized, (req, res) => {
	res.status(200).render('main');
});

app.post('/login', login, (req, res) => {
	res.status(200).redirect('/main');
});

app.post('/logout', isAuthorized, (req, res) => {
	res.clearCookie(JWT_COOKIE_NAME);
	res.status(301).redirect('/');
});


/****************************************************
* Start App
****************************************************/
app.listen(process.env.SERVER_PORT, () => {
	console.log(`server is live on port ${process.env.SERVER_PORT}...`);
});