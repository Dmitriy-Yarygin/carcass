'use strict';

const config = require('../../config')();
const { Model } = require('objection');
const Knex = require('knex');

// Initialize knex.
const knex = Knex({
  client: 'pg',
  useNullAsDefault: true,
  connection: {
    ...config.database
  }
});
// knex.migrate.latest();
// knex.seed.run();

// Give the knex instance to objection.
Model.knex(knex);

module.exports = () => Model;
