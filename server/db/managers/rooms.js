const log = require('../../helpers/logger')(__filename);
const Rooms = require('../models/Rooms');
const Users = require('../models/Users');

const { getObjEnabledFields } = require('../../helpers/validators');
const CREATE_FIELDS = ['name', 'state'];
const READ_FIELDS = ['id', 'name', 'state', 'created_at', 'updated_at'];

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
    return {
      success: false,
      error: { detail: `The room name should be unique.` }
    };
  }

  const result = await user.$relatedQuery('rooms').insert({ name, state });
  result.users = user.email;
  return { success: true, result };
};

const read = async id => {
  let result = id ? Rooms.query().findById(id) : Rooms.query();
  result = await result
    .eager('users(onlyNames, orderByName)')
    .select(...READ_FIELDS);
  // if (result.length) {
  //   result.forEach((room, i) => {
  //     if (room.users.length) {
  //       result[i].users = room.users.map(user => user.email).join(', ');
  //     }
  //   });
  // }
  return { success: true, result };
};

const update = async (id, record) => {
  const notUpdatedRoom = await Rooms.query().findById(id);
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
    .patchAndFetchById(id, {
      ...notUpdatedRoom,
      ...record,
      id
    })
    .select(...READ_FIELDS);
  return { success: true, result };
};

const del = async id => {
  await Rooms.query().deleteById(id);
  return { success: true };
};

const isRoomExist = async id => {
  const result = await Rooms.query().findById(id);
  return !!result;
};

const findByName = name => Rooms.query().where('name', name);

module.exports = {
  create,
  read,
  update,
  del,
  isRoomExist,
  findByName
};
