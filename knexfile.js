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
    tableName: 'knex_migrations'
  }
};

module.exports = {
  development,
  staging: { ...development },
  production: { ...development }
};
