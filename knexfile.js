'use strict';

const config = require('./config')();

const development = {
  client: 'postgresql',
  connection: { ...config.database },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: './server/db/migrations',
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: './server/db/seeds'
  }
};

module.exports = {
  development,
  staging: { ...development },
  production: { ...development }
};
