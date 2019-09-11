const log = require('../../helpers/logger')(__filename);
const Rooms = require('../models/Rooms');
const Users = require('../models/Users');
const Users_rooms = require('../models/Users_rooms');
const GameMap = require('../../game/gameMap');
const TilesStore = require('../../game/tilesStore');

const MAX_PLAYERS_IN_THE_ROOM = 6;

const { getObjEnabledFields } = require('../../helpers/validators');
const CREATE_FIELDS = ['name', 'state'];
const READ_FIELDS = [
  'id',
  'name',
  'owner',
  'state',
  'created_at',
  'updated_at'
];

function makeAnswerWithError(detail) {
  log.warn(detail);
  return { success: false, error: { detail } };
}

const newPlayer = async (id, userId) => {
  const user = await Users.query().findById(userId);
  if (!user) {
    return makeAnswerWithError(`The user with id = ${userId} not found.`);
  }
  const room = await Rooms.query()
    .findById(id)
    .eager('users(onlyIds)');
  if (!room) {
    return makeAnswerWithError(`The room with id = ${id} not found.`);
  }
  const isUserInRoom = room.users.some(user => user.id === userId);
  if (!isUserInRoom && room.state.name !== 'created') {
    return makeAnswerWithError(
      `The game in room with id = ${id} already started.`
    );
  }
  if (room.users.length >= MAX_PLAYERS_IN_THE_ROOM) {
    return makeAnswerWithError(`The room with id = ${id} already filled.`);
  }
  // check is this user already in the room
  if (!isUserInRoom) {
    await Users_rooms.query().insert({
      room_id: id,
      user_id: userId
    });
  }
  return read(id);
};

const create = async ({ name }, userId) => {
  const rooms = await findByName(name);
  if (rooms.length) {
    return makeAnswerWithError(`The room name should be unique.`);
  }
  const user = await Users.query().findById(userId);
  if (!user) {
    return makeAnswerWithError(`The user - room creator not found.`);
  }
  const result = await user
    .$relatedQuery('rooms')
    .insert({ name, state: { name: 'created' }, owner: userId });
  const { id, email } = user;
  result.users = [{ id, email }];
  return { success: true, result };
};

const read = async id => {
  let result = id ? Rooms.query().findById(id) : Rooms.query();
  result = await result.eager('users(withoutPW)').select(...READ_FIELDS);
  return { success: true, result };
};

const update = async (record, userId) => {
  const roomReadAnswer = await read(record.id);
  const notUpdatedRoom = roomReadAnswer.result;
  if (!notUpdatedRoom)
    return makeAnswerWithError(`The room ${record.id} not found.`);

  if (record.name && record.name !== notUpdatedRoom.name) {
    const rooms = await findByName(record.name);
    if (rooms.length) {
      return makeAnswerWithError(`The room name should be unique.`);
    }
  }
  if (!notUpdatedRoom.users.some(({ id }) => id === userId)) {
    // if user not in room => check his role
    const user = await Users.query().findById(userId);
    if (user.role !== 'su' && user.role !== 'admin') {
      return makeAnswerWithError(`Only owner or admin could rename room.`);
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

const getGameData = async (userId, roomId) => {
  const room = await Rooms.query()
    .findById(roomId)
    .eager('users(withoutPW)');
  if (!room) {
    return makeAnswerWithError(`The room with id = ${roomId} not found.`);
  }
  if (!room.users || !room.users.some(user => user.id === userId)) {
    return makeAnswerWithError(`The user with id = ${userId} not in room.`);
  }
  return { success: true, result: room };
};

const startGame = async (userId, roomId) => {
  let result = await getGameData(userId, roomId);
  if (!result.success) {
    return result;
  }
  const { id, state, owner } = result.result;
  if (userId !== owner) {
    return makeAnswerWithError(`Only room owner can start the game!`);
  }
  const gameMap = new GameMap();
  const map = gameMap.get();
  return update(
    {
      id,
      map,
      state: { ...state, name: 'started', turn: 0, playerTurn: owner }
    },
    userId
  );
};

const getTile = async (userId, roomId) => {
  let result = await getGameData(userId, roomId);
  if (!result.success) {
    return result;
  }
  const { id, name, state, map, tiles, users, owner } = result.result;

  // log.error(`tiles = ${JSON.stringify(tiles)}`);

  const tilesStore = new TilesStore(tiles);
  const tile = tilesStore.popTile();

  // log.error(tile);

  return update(
    {
      id,
      tiles: tilesStore.getTilesInBox(),
      state: { ...state, turn: state.turn + 1, playerTurn: owner, tile }
    },
    userId
  );
};

module.exports = {
  newPlayer,
  create,
  read,
  update,
  del,
  isRoomExist,
  findByName,
  getGameData,
  startGame,
  getTile
};
