
exports.seed = function(knex, Promise) {
  return addUsers()
    .then(addGroups)
    .then(addPermissions)
    .then(addUserPermissions)
    .then(addUsersInGroups)
    .then(AddGroupPermissions);

  function addUsers() {
    return knex('users').del()
      .then(function () {
        return knex('users').insert([
          { id: 1, username: 'jsmith', password: 'password1' },
          { id: 2, username: 'jdoe', password: 'password2' },
          { id: 3, username: 'awilliams', password: 'password3' },
        ]);
      });
  }

  function addGroups() {
    return knex('groups')
      .del()
      .then(function() {
        return knex('groups')
          .insert([
            { id: 1, name: 'Basic Users' },
            { id: 2, name: 'Admins' },
          ]);
      });
  }

  function addPermissions() {
    return knex('permissions')
      .del()
      .then(function() {
        return knex('permissions')
          .insert([
            { id: 1, description: 'View Posts' },
            { id: 2, description: 'View User Accounts' },
            { id: 3, description: 'Delete Posts' },
            { id: 4, description: 'Delete User Accounts' },
          ]);
      });
  }

  function addUserPermissions() {
    return knex('userpermissions')
      .del()
      .then(function() {
        return knex('userpermissions')
          .insert([
            { userid: 1, permissionid: 3 },
          ]);
      });
  }

  function addUsersInGroups() {
    return knex('usersingroups')
      .del()
      .then(function() {
        return knex('usersingroups')
          .insert([
            { userid: 1, groupid: 1 },
            { userid: 2, groupid: 1 },
            { userid: 3, groupid: 2 },
          ]);
      });
  }

  function AddGroupPermissions() {
    return knex('grouppermissions')
      .del()
      .then(function() {
        return knex('grouppermissions')
          .insert([
            { groupid: 1, permissionid: 1 },
            { groupid: 1, permissionid: 2 },
            { groupid: 2, permissionid: 3 },
            { groupid: 2, permissionid: 4 },
          ]);
      });
  }
};
