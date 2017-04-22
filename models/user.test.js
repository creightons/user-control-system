const { assert } = require('chai'),
	config = require('../knexfile'),
	knex = require('knex')(config),
	UserModel = require('./user');

const Users = new UserModel(knex);

describe('Users Model', function() {
	describe('findByCredentials()', function() {
		it('should find a user in the database when given valid credentials', function() {
			return Users
				.findByCredentials('jsmith', 'password1')
				.then(users => {
					assert.deepEqual(users, [
						{ id: 1, username: 'jsmith' },
					]);
				});
		});

		it('should not find a user who is not in the database', function() {
			return Users
				.findByCredentials('mallen', 'not-a-password')
				.then(users => {
					assert.deepEqual(users, []);
				});
		});
	});
});