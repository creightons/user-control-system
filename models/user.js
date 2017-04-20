const knex = require('knex');

class User {
	constructor(knex) {
		this.knex = knex;
	}

	findByCredentials(username, password) {
		return this.knex
			.select([
				'id',
				'username',
			])
			.from('users')
			.where('username', username)
			.where('password', password);
	}
}

module.exports = User;