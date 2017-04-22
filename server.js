const express = require('express');

const app = express();

const jwt = require('jsonwebtoken'),
	bodyParser = require('body-parser'),
	knexConfig = require('./knexfile'),
	knex = require('knex')(knexConfig),
	UserModel = require('./models/user'),
	dotenv = require('dotenv');

dotenv.config();

const COOKIE_NAME = 'AUTH_TOKEN';
const THIRTY_MINUTES = 30 * 60 * 1000;

const User = new UserModel(knex);

app.set('view engine', 'pug');
app.set('views', 'views');

// Parse body from form-based POST requests
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
	res.status(200).render('base');
});

function authenticate(req, res) {
	const { username, password } = req.body;
	
	User.findByCredentials(username, password)
		.then( ( [ userData ] ) => {
			if (userData !== undefined || userData !== null) {
				const token = jwt.sign(userData, process.env.JWT_SECRET);
				res.cookie(COOKIE_NAME, token, {
					maxAge: THIRTY_MINUTES,
					httpOnly: true,
				});

				return res.status(200).send('yes');
			}

			res.status(400).send('error');
		})
		.catch(err => {
			console.log('err = ', err.stack);
			res.status(500).send('error');
		});

}

app.post('/login', authenticate);

function login(req, res, next) {
	


app.listen(process.env.SERVER_PORT, () => {
	console.log(`server is live on port ${process.env.SERVER_PORT}...`);
});