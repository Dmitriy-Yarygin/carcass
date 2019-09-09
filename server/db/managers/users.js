const log = require('../../helpers/logger')(__filename);
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Users = require('../models/Users');

const { getObjEnabledFields } = require('../../helpers/validators');
const CREATE_FIELDS = ['email', 'password', 'role'];
const READ_FIELDS = ['id', 'email', 'role'];

const registrate = async ({ email, password, role }) => {
  const hash = await bcrypt.hash(password, saltRounds);
  const user = await Users.query().insert({ email, password: hash, role });
  return { success: true, email: user.email };
};

const login = async ({ email, password }) => {
  const usersArray = await Users.query().where('email', email);
  if (usersArray.length === 0) {
    return { success: false, msg: `The user with email = ${email} not found.` };
  }
  const user = usersArray[0];
  const success = await bcrypt.compare(password, user.password);
  if (success) {
    delete user.password;
    return { success, user };
  }
  return { success, msg: `You entered wrong password for email = ${email}` };
};

const getUserRooms = async id => {
  result = await Users.query()
    .findById(id)
    .eager('rooms');
  return { success: true, result };
};

const read = async id => {
  let result = id ? Users.query().findById(id) : Users.query();
  result = await result.select(...READ_FIELDS);
  return { success: true, result };
};

const update = async (id, record) => {
  const notUpdatedUser = await Users.query().findById(id);
  const password = record.password
    ? await bcrypt.hash(record.password, saltRounds)
    : notUpdatedUser.password;

  const result = await Users.query()
    .patchAndFetchById(id, {
      ...notUpdatedUser,
      ...record,
      password,
      id
    })
    .select(...READ_FIELDS);
  return { success: true, result };
};

const del = async id => {
  await Users.query().deleteById(id);
  return { success: true };
};

const findByEmail = email => Users.query().where('email', email);

const isEmailRegistered = async email => {
  const result = await Users.query().where('email', email);
  return result.length > 0;
};

const isUserExist = async id => {
  const result = await Users.query().findById(id);
  return !!result;
};

module.exports = {
  registrate,
  login,
  read,
  update,
  del,
  findByEmail,
  isEmailRegistered,
  isUserExist
};
