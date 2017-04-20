
class Permissions() {

	constructor(knex) {
		this.knex = knex;
	}

	getByUserId(userId) {
		return this.knex
			.select([
				'permissions.id',
				'permissions.description',
			])
			.from('permissions')
			.innerJoin(
				'userpermissions',
				'userpermissions.permissionid',
				'permissions.id'
			)
			.where('userpermissions.userid', userId)
			.union(function() {
				this
					.select([
						'permissions.id',
						'permissions.description',
					])
					.from('permissions')
					.innerJoin(
						'grouppermissions',
						'grouppermissions.permissionid',
						'permissions.id'
					)
					.innerJoin(
						'usersingroups',
						'usersingroups.groupid',
						'grouppermissions.groupid'
					)
					.where('usersingroups.userid', userId);
			});
	}
}

module.exports = Permissions;