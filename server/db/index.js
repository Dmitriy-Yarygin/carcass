'use strict';

const config = require('../../config')();
const { Model } = require('objection');
const Knex = require('knex');

// Initialize knex.
const knex = Knex({
  client: 'pg',
  useNullAsDefault: true,
  connection: {
    connectionString: config.database,
    ssl: config.database.includes('localhost') 
      ? false 
      : {
        rejectUnauthorized: false,
      },
  },
});
knex.migrate.latest()
  .then(([migrationStatus])=>{
    if (migrationStatus===1) knex.seed.run();
  })
  .catch(console.error);

// Give the knex instance to objection.
Model.knex(knex);

module.exports = () => Model;
