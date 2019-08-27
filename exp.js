const bcrypt = require('bcrypt');
const saltRounds = 10;
let users = [
  { email: 'aaa', role: 'su' },
  { email: 'bbb', role: 'admin' },
  { email: 'ccc', role: '' },
  { email: 'ddd', role: '' }
];

const usersWithPasswordPromises = Promise.all(
  users.map(user => {
    return bcrypt.hash(user.email, saltRounds);
  })
);

usersWithPasswordPromises.then(function(values) {
  values.forEach((hash, i) => {
    users[i] = { ...users[i], password: hash };
  });
});

/*
const usersWithPasswordPromises = Promise.all(
    users.map(user => {
      return bcrypt.hash(user.email, saltRounds);
    })
  );
  
  usersWithPasswordPromises.then(function(values) {
    users.forEach((user, i) => ({ ...user, password: values[i] }));
    console.log(users);
  });
  */
