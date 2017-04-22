const { assert } = require('chai'),
	config = require('../knexfile'),
	knex = require('knex')(config),
	PermissionsModel = require('./permission');

const Permissions = new PermissionsModel(knex);

describe('Permissions Model', function() {
	describe('getByUserId()', function() {
		it('should get all permissions for a user in the user group', function() {
			const userId = 2;
			return Permissions
				.getByUserId(userId)
				.then(permissions => {
					assert.deepEqual(permissions, [
						{ id: 1, description: 'View Posts' },
						{ id: 2, description: 'View User Accounts' },
					]);
				});
		});

		it('should get all permissions for a user in the user group and with custom permissions', function() {
			const userId = 1;
			return Permissions
				.getByUserId(userId)
				.then(permissions => {
					assert.deepEqual(permissions, [
						{ id: 1, description: 'View Posts' },
						{ id: 2, description: 'View User Accounts' },
						{ id: 3, description: 'Delete Posts' },
					]);
				});
		});

		it('should get all permissions for a user in the admin group', function() {
			const userId = 3;
			return Permissions
				.getByUserId(userId)
				.then(permissions => {
					assert.deepEqual(permissions, [
						{ id: 3, description: 'Delete Posts' },
						{ id: 4, description: 'Delete User Accounts' },
					]);
				});
		});

		it('should get no permissions if the user does not exit', function() {
			const userId = 4;
			return Permissions
				.getByUserId(userId)
				.then(permissions => {
					assert.deepEqual(permissions, []);
				});
		});
	});
});