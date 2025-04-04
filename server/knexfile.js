/* 
  Update with your config settings.
  The test database and development database are by default the same.
  Knex also allows for easy switching between databases. 
  But the .returning() method will only work for PostgreSQL, MSSQL, and Oracle databases.
*/
require('dotenv').config();
module.exports = {

  test: {
    client: 'postgresql',
    connection: {
      database: process.env.PGDATABASE,
      user:     process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || 5432,
    },
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 5000
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  development: {
    client: 'pg',
    connection: {
      database: process.env.PGDATABASE,
      user:     process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || 5432,
    },
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 5000
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password',
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || 5432,
    },
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 5000
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 5000
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
