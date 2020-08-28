Database Migrations
===================

This project is responsible for database migrations, and uses https://npmjs.org/db-migrate.


Setup
-----

1. Copy database-sample.json into database.json and update the data connection details.

2. `npm install`.


Usage
-----

### Create a new migration:

1. `npm run db-create-change some-migration-name-here` swapping in a descriptive name for the change you'll build.  This builds sql files in `migrations/sqls/` for both up (add this change) and down (remove this change).

2. Modify the `migrations/sqls/` up and down sql files to do the intended change.

3. `npm run db-up` to run all pending migrations including this one.


### Update database to the latest

1. `git pull`

2. `npm run db-up`.  This runs the up scripts for all migrations not yet run.


### Reset the database to the beginning

1. `npm run db-reset`  This runs the down scripts for all migrations.  In this project, it'll leave you with an empty database (except for the empty migrations table).
