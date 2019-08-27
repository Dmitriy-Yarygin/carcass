exports.up = function(knex) {
  return knex.schema.createTable('rooms', table => {
    table.increments('id').primary();
    table.string('name').unique();
    table.timestamps(true, true);
    table.string('state');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('rooms');
};
