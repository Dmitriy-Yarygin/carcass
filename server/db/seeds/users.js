const bcrypt = require('bcrypt');
const saltRounds = 10;
const users = [
  { email: 'aaa', role: 'su' },
  { email: 'bbb', role: 'admin' },
  { email: 'ccc', role: '' },
  { email: 'ddd', role: '' },
  { email: 'eee', role: '' }
];

const usersPasswordsPromises = Promise.all(
  users.map(user => {
    return bcrypt.hash(user.email, saltRounds);
  })
);

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(() =>
      usersPasswordsPromises
        .then(values =>
          values.map((hash, i) => ({ ...users[i], password: hash }))
        )
        .then(users => knex('users').insert(users))
    );
};
