const rooms = [{ name: 'Room A' }, { name: 'Room B' }, { name: 'Room C' }];

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('rooms')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('rooms').insert(rooms);
    });
};
