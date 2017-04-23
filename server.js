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
	PermissionModel = require('./models/permission'),
	Permissions = new PermissionModel(knex),
	dotenv = require('dotenv');

dotenv.config();

/****************************************************
* Constants
****************************************************/
const JWT_COOKIE_NAME = 'AUTH_TOKEN';
const THIRTY_MINUTES = 30 * 60 * 1000;
const VIEW_POSTS_PERMISSION_ID = 1;
const VIEW_USER_ACCOUNTS_PERMISSION_ID = 2;
const DELETE_POSTS_PERMISSION_ID = 3;
const DELETE_USER_ACCOUNTS_PERMISSION_ID = 4;

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
* Custom Middleware
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

function getPermissionGatekeeper(PERMISSION_ID) {
	return (req, res, next) => {
		const userId = req.user.id

		Permissions
			.getByUserId(userId)
			.then(userPermissions => {
				const validPermission = userPermissions.find(
					permission => permission.id === PERMISSION_ID
				);

				// If the current user does not have the required permission, deny access to the user
				if (validPermission === undefined) {
					return res.status(400).render('forbidden');
				}
				else {
					return next();
				}
			})
			.catch(err => handleError(err, res));
	}
}

const viewPostsGatekeeper = getPermissionGatekeeper(VIEW_POSTS_PERMISSION_ID);
const viewUserAccountsGatekeeper = getPermissionGatekeeper(VIEW_USER_ACCOUNTS_PERMISSION_ID);
const deletePostsGatekeeper = getPermissionGatekeeper(DELETE_POSTS_PERMISSION_ID);
const deleteUserAccountsGatekeeper = getPermissionGatekeeper(DELETE_USER_ACCOUNTS_PERMISSION_ID);

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

// All routes after this are private
app.use(isAuthorized);

app.post('/logout', (req, res) => {
	res.clearCookie(JWT_COOKIE_NAME);
	res.status(301).redirect('/');
});

app.get('/view-posts', viewPostsGatekeeper, (req, res) => {
	res.status(200).render('posts');
});

app.get('/view-accounts', viewUserAccountsGatekeeper, (req, res) => {
	res.status(200).render('accounts');
});

app.get('/delete-posts', deletePostsGatekeeper, (req, res) => {
	res.status(200).render('delete-posts');
});

app.get('/delete-accounts', deleteUserAccountsGatekeeper, (req, res) => {
	res.status(200).render('delete-accounts');
});

/****************************************************
* Start App
****************************************************/
app.listen(process.env.SERVER_PORT, () => {
	console.log(`Server is live on port ${process.env.SERVER_PORT}...`);
});