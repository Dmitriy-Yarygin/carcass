exports.up = function(knex) {
  return knex.schema.createTable('rooms', table => {
    table.increments('id').primary();
    table.string('name').unique();
    table.timestamps(true, true);
    table.jsonb('state');
    table.jsonb('map');
    table.specificType('tiles', 'json ARRAY');
    table.integer('owner');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('rooms');
};
