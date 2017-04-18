require('dotenv').config();

module.exports = {
	client: 'sqlite3',
	connection: {
		filename: process.env.SQLITE_PATH,
	},
};