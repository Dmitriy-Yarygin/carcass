const log = require('../../helpers/logger')(__filename);
const Rooms = require('../models/Rooms');
const Users = require('../models/Users');
const Users_rooms = require('../models/Users_rooms');
const GameMap = require('../../game/gameMap');
const TilesStore = require('../../game/tilesStore');

const MAX_PLAYERS_IN_THE_ROOM = 6;
const STARTING_MIPLES_QUANTITY = 10;

const READ_FIELDS = [
  'id',
  'name',
  'owner',
  'game_state',
  'stamped_map',
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
  if (!isUserInRoom && room.game_state.name !== 'created') {
    return makeAnswerWithError(
      `The game in room with id = ${id} is already ${room.game_state.name}.`
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
    .insert({ name, game_state: { name: 'created' }, owner: userId });
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
  const { id, game_state, owner, users } = result.result;
  if (userId !== owner) {
    return makeAnswerWithError(`Only room owner can start the game!`);
  }

  // const allTilesInChessOrder = require('../../game/allTilesInChessOrder');
  // const gameMap = new GameMap(allTilesInChessOrder());
  const gameMap = new GameMap();

  const turnOrder = users.map(({ id }) => id);
  const progress = {};
  users.forEach(
    ({ id }) =>
      (progress[id] = { scores: 0, freeMiples: STARTING_MIPLES_QUANTITY })
  );
  const tilesStore = new TilesStore();

  return update(
    {
      id,
      stamped_map: gameMap.get(),
      game_state: {
        ...game_state,
        name: 'started',
        stage: 'pass',
        turn: 1,
        playerTurn: 0,
        tilesInStack: tilesStore.howManyTilesInStack(),
        turnOrder,
        progress
      }
    },
    userId
  );
};

const getTile = async (userId, roomId) => {
  let result = await getGameData(userId, roomId);
  if (!result.success) {
    return result;
  }
  const { id, game_state, tiles } = result.result;
  const { turnOrder, playerTurn } = game_state;

  switch (true) {
    case game_state.name === 'created':
      return makeAnswerWithError(`Room owner should start the game!`);
    case game_state.name === 'finished':
      return makeAnswerWithError(`Game is over! No more tiles in stack!`);
    case userId !== turnOrder[playerTurn]:
      return makeAnswerWithError(`It's not your turn!`);
    case game_state.tile:
      return makeAnswerWithError(`Player already take tile !`);
    case game_state.stage !== 'pass':
      return makeAnswerWithError(
        `You should put tile on board and set miple or pass the move!`
      );
  }

  const tilesStore = new TilesStore(tiles);
  const tile = tilesStore.popTile();
  return update(
    {
      id,
      tiles: tilesStore.getTilesInBox(),
      game_state: {
        ...game_state,
        tile,
        tilesInStack: tilesStore.howManyTilesInStack(),
        stage: 'gotTile',
        lastTilePosition: null
      }
    },
    userId
  );
};

const putTile = async (userId, roomId, position, rotation) => {
  let result = await getGameData(userId, roomId);
  if (!result.success) {
    return result;
  }

  const { id, game_state, stamped_map } = result.result;
  const { turnOrder, playerTurn } = game_state;
  if (userId !== turnOrder[playerTurn]) {
    return makeAnswerWithError(`It's not your turn!`);
  }

  const gameMap = new GameMap(stamped_map.tilesMap);
  const success = gameMap.putTileOnMap(game_state.tile, position, rotation);
  // cos cut extended map and 0 row and 0 column after after another extend will be 1
  const lastTilePosition = { x: position.x || 1, y: position.y || 1 };
  if (success) {
    return update(
      {
        id,
        game_state: {
          ...game_state,
          tile: null,
          stage: 'putTile',
          lastTilePosition
        },
        stamped_map: gameMap.get()
      },
      userId
    );
  }
  return makeAnswerWithError(`Can't put this tile on the map!`);
};

const passMoove = async (userId, roomId, key) => {
  log.verbose(`key >>> ${key}, userId=${userId}, roomId=${roomId}`);
  let result = await getGameData(userId, roomId);
  if (!result.success) {
    return result;
  }
  let { id, game_state, stamped_map, tiles } = result.result;
  let { turn, turnOrder, playerTurn, progress } = game_state;

  if (userId !== turnOrder[playerTurn]) {
    return makeAnswerWithError(`It's not your turn!`);
  }
  if (game_state.stage !== 'putTile') {
    return makeAnswerWithError(
      `You can pass the move only after putting tile on board!`
    );
  }
  const gameMap = new GameMap(stamped_map.tilesMap);
  if (key) {
    if (!gameMap.setMipleOnMap(userId, key, game_state.lastTilePosition)) {
      return makeAnswerWithError(
        `You can't set miple on that place becouse object alredy occupied!`
      );
    }
    if (progress[userId].freeMiples === 0) {
      return makeAnswerWithError(`You haven't any free miple!`);
    }
    progress[userId].freeMiples--;
  }

  gameMap.endTurnScoresCount(game_state.lastTilePosition);
  if (tiles.length) {
    playerTurn = (playerTurn + 1) % turnOrder.length;
    turn++;
  } else {
    game_state.name = 'finished';
    // TODO final count
  }
  return update(
    {
      id,
      game_state: {
        ...game_state,
        stage: 'pass',
        turn,
        playerTurn,
        progress
      },
      stamped_map: gameMap.get()
    },
    userId
  );
};

const takeOffMiple = async (userId, roomId, key, position) => {
  log.verbose(
    `takeOffMiple key >>> ${key}, pos=${JSON.stringify(
      position
    )} userId=${userId}, roomId=${roomId}`
  );
  let result = await getGameData(userId, roomId);
  if (!result.success) {
    return result;
  }
  let { id, game_state, stamped_map } = result.result;
  let { progress } = game_state;

  const gameMap = new GameMap(stamped_map.tilesMap);
  if (!gameMap.takeOffMiple(userId, key, position, progress)) {
    return makeAnswerWithError(`You can't take off this miple!`);
  }
  return update(
    {
      id,
      game_state: {
        ...game_state,
        progress
      },
      stamped_map: gameMap.get()
    },
    userId
  );
};
// FORCEsetMiple /////////////////////////////////////////////////////////
const FORCEsetMiple = async (userId, roomId, key, position) => {
  log.verbose(
    `FORCEsetMiple key >>> ${key}, userId=${userId}, roomId=${roomId}`
  );
  let result = await getGameData(userId, roomId);
  if (!result.success) {
    return result;
  }
  let { id, game_state, stamped_map, tiles } = result.result;
  let { turn, turnOrder, playerTurn, progress } = game_state;

  const gameMap = new GameMap(stamped_map.tilesMap);
  gameMap.FORCEsetMiple(userId, key, position);

  return update(
    {
      id,
      stamped_map: gameMap.get()
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
  getTile,
  putTile,
  passMoove,
  takeOffMiple,
  FORCEsetMiple
};
