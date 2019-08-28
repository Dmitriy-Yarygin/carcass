exports.up = function(knex) {
  return knex.schema.createTable('users_rooms', table => {
    table.increments().primary();
    table
      .integer('user_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .integer('room_id')
      .unsigned()
      .references('id')
      .inTable('rooms')
      .onDelete('CASCADE');

    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users_rooms');
};
