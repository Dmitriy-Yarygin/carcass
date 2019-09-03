const log = require('../../helpers/logger')(__filename);
const Rooms = require('../models/Rooms');
const Users = require('../models/Users');
const Users_rooms = require('../models/Users_rooms');
const MAX_PLAYERS_IN_THE_ROOM = 6;

const { getObjEnabledFields } = require('../../helpers/validators');
const CREATE_FIELDS = ['name', 'state'];
const READ_FIELDS = ['id', 'name', 'state', 'created_at', 'updated_at'];
/////////////////////////////////////////////////////////////////////////////
const newPlayer = async (id, userId) => {
  const room = await Rooms.query()
    .findById(id)
    .eager('users(onlyIds)');
  if (!room) {
    log.error(`The room with id = ${id} not found.`);
    return {
      success: false,
      error: { detail: `The room with id = ${id} not found.` }
    };
  }
  if (room.users && room.users.length >= MAX_PLAYERS_IN_THE_ROOM) {
    log.error(`The room with id = ${id} already filled.`);
    return {
      success: false,
      error: { detail: `The room with id = ${id} already filled.` }
    };
  }
  if (room.users.find(user => user.id === userId)) {
    log.error(`The user ${userId} alredy in room ${id}.`);
    return {
      success: false,
      error: { detail: `The user ${userId} alredy in room ${id}.` }
    };
  }

  const user = await Users.query().findById(userId);
  if (!user) {
    return {
      success: false,
      error: { detail: `The user with id = ${userId} not found.` }
    };
  }

  let result = await Users_rooms.query().insert({
    room_id: id,
    user_id: userId
  });

  return read(id);
};
/////////////////////////////////////////////////////////////////////////////
const create = async ({ name, state }, userId) => {
  const user = await Users.query().findById(userId);
  if (!user) {
    return {
      success: false,
      error: { detail: `The user - room creator not found.` }
    };
  }
  const rooms = await findByName(name);
  if (rooms.length) {
    log.error(`The room name should be unique.`);
    return {
      success: false,
      error: { detail: `The room name should be unique.` }
    };
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
    // .eager('users()')
    .select(...READ_FIELDS);
  // if (result.length) {
  //   result.forEach((room, i) => {
  //     if (room.users.length) {
  //       result[i].users = room.users.map(user => user.email).join(', ');
  //     }
  //   });
  // }
  // log.info('Manager read ROOMS %O', result);
  return { success: true, result };
};

const update = async (record, userId) => {
  const roomReadAnswer = await read(record.id, userId);
  const notUpdatedRoom = roomReadAnswer.result;
  if (!notUpdatedRoom) {
    return {
      success: false,
      error: { detail: `The room ${record.id} not found.` }
    };
  }
  if (record.name) {
    const rooms = await findByName(record.name);
    if (rooms.length) {
      return {
        success: false,
        error: { detail: `The room name should be unique.` }
      };
    }
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
