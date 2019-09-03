const log = require('../../helpers/logger')(__filename);
const Rooms = require('../models/Rooms');
const Users = require('../models/Users');
const Users_rooms = require('../models/Users_rooms');
const MAX_PLAYERS_IN_THE_ROOM = 6;

const { getObjEnabledFields } = require('../../helpers/validators');
const CREATE_FIELDS = ['name', 'state'];
const READ_FIELDS = ['id', 'name', 'state', 'created_at', 'updated_at'];

function makeAnswerWithError(detail) {
  log.warn(detail);
  return { success: false, error: { detail } };
}

const newPlayer = async (id, userId) => {
  const room = await Rooms.query()
    .findById(id)
    .eager('users(onlyIds)');
  if (!room) {
    return makeAnswerWithError(`The room with id = ${id} not found.`);
  }
  if (room.users && room.users.length >= MAX_PLAYERS_IN_THE_ROOM) {
    return makeAnswerWithError(`The room with id = ${id} already filled.`);
  }
  if (room.users.find(user => user.id === userId)) {
    return makeAnswerWithError(`The user ${userId} alredy in room ${id}.`);
  }
  const user = await Users.query().findById(userId);
  if (!user) {
    return makeAnswerWithError(`The user with id = ${userId} not found.`);
  }
  await Users_rooms.query().insert({
    room_id: id,
    user_id: userId
  });
  return read(id);
};

const create = async ({ name, state }, userId) => {
  const rooms = await findByName(name);
  if (rooms.length) {
    return makeAnswerWithError(`The room name should be unique.`);
  }
  const user = await Users.query().findById(userId);
  if (!user) {
    return makeAnswerWithError(`The user - room creator not found.`);
  }
  const result = await user.$relatedQuery('rooms').insert({ name, state });
  const { id, email } = user;
  result.users = [{ id, email }];
  return { success: true, result };
};

const read = async (id, userId) => {
  let result = id ? Rooms.query().findById(id) : Rooms.query();
  result = await result
    .eager('users(withoutPW, orderByName)')
    .select(...READ_FIELDS);
  return { success: true, result };
};

const update = async (record, userId) => {
  const roomReadAnswer = await read(record.id, userId);
  const notUpdatedRoom = roomReadAnswer.result;
  if (!notUpdatedRoom)
    return makeAnswerWithError(`The room ${record.id} not found.`);
  if (record.name) {
    const rooms = await findByName(record.name);
    if (rooms.length) {
      return makeAnswerWithError(`The room name should be unique.`);
    }
  }

  const user = await Users.query().findById(userId);
  if (
    user.role !== 'su' &&
    user.role !== 'admin' &&
    !notUpdatedRoom.users.some(({ id }) => id === userId)
  ) {
    return makeAnswerWithError(`Only entered into room users could rename it.`);
  }

  const result = await Rooms.query()
    .patchAndFetchById(record.id, {
      ...notUpdatedRoom,
      ...record
    })
    .select(...READ_FIELDS);
  return { success: true, result };
};

const del = async (id, userId) => {
  const user = await Users.query().findById(userId);
  if (!user) {
    return makeAnswerWithError(`The user with id = ${userId} not found.`);
  }
  if (user.role !== 'su' && user.role !== 'admin') {
    return makeAnswerWithError(`You haven't rights for room deleting.`);
  }
  await Rooms.query().deleteById(id);
  return { success: true, id };
};

const isRoomExist = async id => {
  const result = await Rooms.query().findById(id);
  return !!result;
};

const findByName = name => Rooms.query().where('name', name);

module.exports = {
  newPlayer,
  create,
  read,
  update,
  del,
  isRoomExist,
  findByName
};
