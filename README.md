# user-control-system

Implementation of a simple user-access-control system. Permissions are granted based on groups and on individual users. Certain routes are gated based upon certain permissions.

To run the app:

- Make sure you have `node.js` and `npm` installed (was built using `node v 6.9.3`, `npm v 3.10.10`)
- Install dependencies `npm install`
- Use sqlite3 to create a new database called `mydb.sqlite`
- Install knex js `npm install -g knex`
- Make sure to have a `.env` file configured like `.env.sample`
- Run the initial migrations `knex migrate:latest`
- Install the test data `knex seed:run`
- Start the app `npm start`
- Go to `localhost:3000` and try logging in and accessing routes with the information below


Gated Routes
--
- /view-posts
- /view-user-accounts
- /delete-posts
- /delete-user-accounts

Groups
--
Name | Permissions
--- | ---
Users | Can view (posts / user accounts)
Admins | Can delete (posts / user accounts)

  
 Users
 -- 

Username | Password | Group(s) | Additional Permissions
--- | --- | --- | ---
jsmith | password1 | Users | Can delete posts
jdoe | password2 | Users | N/A
awilliams | password3 | Admins | N/A

