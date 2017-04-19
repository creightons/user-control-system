
exports.up = function(knex, Promise) {

	return createPermissions()
		.then(createUserPermissions())
		.then(createGroups())
		.then(createUsersInGroups())
		.then(createGroupPermissions());

	function createPermissions() {
		return knex.schema.createTable('permissions', table => {
			table.increments('id').notNullable();
			table.string('description', 300).notNullable();
		});
	}

	function createUserPermissions() {
		return knex.schema.createTable('userpermissions', table => {
			table.integer('userid').notNullable();
			table.integer('permissionid').notNullable();
		});
	}

	function createGroups() {
		return knex.schema.createTable('groups', table => {
			table.increments('id').notNullable();
			table.string('name', 50).notNullable();
		});
	}

	function createUsersInGroups() {
		return knex.schema.createTable('usersingroups', table => {
			table.integer('userid').notNullable();
			table.integer('groupid').notNullable();
		});
	}

	function createGroupPermissions() {
		return knex.schema.createTable('grouppermissions', table => {
			table.integer('groupid').notNullable();
			table.integer('permissionid').notNullable();
		});
	}
};

exports.down = function(knex, Promise) {
	return dropPermissions()
		.then(dropUserPermissions())
		.then(dropGroups())
		.then(dropGroupPermissions())
		.then(dropUsersInGroups());

	function dropPermissions() {
		return knex.schema.dropTable('permissions');
	}

	function dropUserPermissions() {
		return knex.schema.dropTable('userpermissions');
	}

	function dropGroups() {
		return knex.schema.dropTable('groups');
	}

	function dropUsersInGroups() {
		return knex.schema.dropTable('usersingroups');
	}

	function dropGroupPermissions() {
		return knex.schema.dropTable('grouppermissions');
	}
};
