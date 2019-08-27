exports.up = function(knex) {
  return knex.schema.createTable('users_rooms', table => {
    table.increments().primary();
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users');
    table
      .integer('room_id')
      .unsigned()
      .references('id')
      .inTable('rooms');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users_rooms');
};
