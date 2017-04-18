
exports.up = function(knex, Promise) {
	return knex.schema.createTableIfNotExists('users', function(table) {
		table.increments();
		table.string('username', 25);
		table.string('password', 25);
		table.unique('username');
	});
};

exports.down = function(knex, Promise) {
 	return knex.schema.dropTable('users');
};
