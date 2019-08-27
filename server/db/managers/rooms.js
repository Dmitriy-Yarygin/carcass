const log = require('../../helpers/logger')(__filename);
const Rooms = require('../models/Rooms');

const { getObjEnabledFields } = require('../../helpers/validators');
const CREATE_FIELDS = ['name', 'state'];
const READ_FIELDS = ['id', 'name', 'state'];

const create = async ({ name, state }) => {
  const rooms = await findByName(name);
  if (rooms.length) {
    return {
      success: false,
      error: { detail: `The room name should be unique.` }
    };
  }

  const result = await Rooms.query().insert({ name, state });
  return { success: true, result };
};

const read = async id => {
  let result = id ? Rooms.query().findById(id) : Rooms.query();
  result = await result.select(...READ_FIELDS);
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
