'use strict';

const config = require('./config')();

const development = {
  client: 'postgresql',
  connection: {
    connectionString: config.database,
    ssl: config.database.includes('localhost') 
      ? false 
      : {
        rejectUnauthorized: false,
      },
  },
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
