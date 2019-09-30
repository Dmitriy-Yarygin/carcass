const log = require('../helpers/logger')(__filename);
const roomsManager = require('../db/managers/rooms');
const usersRoomsManager = require('../db/managers/users-rooms');
const redisStore = require('../db/redis');
const userSessionSocket = require('../helpers/userSessionSocket');

const IO = require('koa-socket-2');
class CarcaIO {
  constructor() {
    if (!CarcaIO.instance) {
      CarcaIO.instance = new IO();
    }
    return CarcaIO.instance;
  }
}

const io = new CarcaIO();

function joinRoom(socket, userId, roomId) {
  const roomNick = `room${roomId}`;
  socket.join(roomNick, () => {
    socket.to(roomNick).emit('newPlayer', { roomNick, userId });
  });
}

function carcaSockets(app) {
  io.attach(app);
  io.on('connection', async socket => {
    let sid;
    log.info('socket.handshake >>>>>>>>>>>> ');

    if (!socket.handshake.headers.cookie) {
      log.warn('======= cookie absent ==========');
      return socket.disconnect(true);
    }

    log.warn(socket.handshake.headers.cookie);
    sid = userSessionSocket.getSid(socket.handshake.headers.cookie);
    socket.session = await redisStore.get(sid);

    if (!socket.session || !socket.session.user) {
      log.warn('User should login!');
      return socket.disconnect(true);
    }

    const userId = socket.session.user.id;
    userSessionSocket.setSid(userId, sid);

    const newSocketId = socket.id;
    const oldSocketId = userSessionSocket.getSocketId(userId);
    if (oldSocketId && oldSocketId !== newSocketId) {
      const socketConnection = io.connections.get(oldSocketId);
      if (socketConnection) {
        socketConnection.disconnect(true);
      }
    }
    userSessionSocket.setSocketId(userId, newSocketId);
    const rooms = await usersRoomsManager.getUserRooms(userId);
    rooms.forEach(({ room_id }) => joinRoom(socket, userId, room_id));

    socket.broadcast.emit('user:connected', socket.session.user);
    log.silly(`User connected >>>`);
    log.warn(socket.session.user);

    /////////////////////////////////////////////////////////////////////////////////////////////

    socket.on('show me rooms', async (obj, callback) => {
      let rooms = socket.rooms;
      callback(rooms);
    });

    socket.on('game: get map', async ({ roomId }, callback) => {
      const userId = socket.session.user.id;
      const result = await roomsManager.getGameData(userId, roomId);
      callback(result);
    });

    ////////////     game: start        ///////////////////////
    socket.on('game: start', async ({ roomId }, callback) => {
      const userId = socket.session.user.id;
      const result = await roomsManager.startGame(userId, roomId);
      callback(result);
      if (result.success) io.broadcast(`rooms:update`, result);
    });

    ////////////     game: get tile         ///////////////////////
    socket.on('game: get tile', async ({ roomId }, callback) => {
      const userId = socket.session.user.id;
      const result = await roomsManager.getTile(userId, roomId);
      callback(result);
    });

    ////////////////////  socket.emit('game: put tile', { }, answer => {
    socket.on(
      'game: put tile',
      async ({ roomId, position, rotation }, callback) => {
        const userId = socket.session.user.id;
        const result = await roomsManager.putTile(
          userId,
          roomId,
          position,
          rotation
        );
        callback(result);
        //   if (result.success)
        //     socket.to(`room${roomId}`).emit('rooms:update', result);
      }
    );

    ////////////////////  socket.emit('game: pass the moove', {
    socket.on('game: pass the moove', async ({ roomId, key }, callback) => {
      const userId = socket.session.user.id;
      const result = await roomsManager.passMoove(userId, roomId, key);
      if (callback) callback(result);
      if (result.success) {
        socket.to(`room${roomId}`).emit('rooms:update', result);
        const { users, game_state } = result.result;
        const { playerTurn, turnOrder } = game_state;
        const nextPlayerId = turnOrder[playerTurn];
        const userName = users.find(({ id }) => id === nextPlayerId).email;
        const nextPlayerSocketId = userSessionSocket.getSocketId(nextPlayerId);
        const nextPlayerSocketConnection = io.connections.get(
          nextPlayerSocketId
        );
        if (nextPlayerSocketConnection) {
          nextPlayerSocketConnection.emit(
            'game: player notify',
            `${userName}, it's your turn now!`
          );
        }
      }
    });

    // socket.emit('game: take off miple', { roomId, key: name }, answer => {
    socket.on(
      'game: take off miple',
      async ({ roomId, key, position }, callback) => {
        const userId = socket.session.user.id;
        const result = await roomsManager.takeOffMiple(
          userId,
          roomId,
          key,
          position
        );
        if (callback) callback(result);
        if (result.success)
          socket.to(`room${roomId}`).emit('rooms:update', result);
      }
    );

    // 'game: FORCE set miple',    // only for development testing
    socket.on(
      'game: FORCE set miple',
      async ({ roomId, key, position }, callback) => {
        const userId = socket.session.user.id;
        const result = await roomsManager.FORCEsetMiple(
          userId,
          roomId,
          key,
          position
        );
        if (callback) callback(result);
        if (result.success)
          socket.to(`room${roomId}`).emit('rooms:update', result);
      }
    );

    //////////////////////////////////////////////////////////////////////////////////////////////
    socket.on('rooms', async ({ method, data }, callback) => {
      // log.info(`Server rooms:${method} >>> %O`, data);
      const userId = socket.session.user.id;
      const result = await roomsManager[method](data, userId);
      log.verbose(`result = await roomsManager.${method}() >>> %O`, result);
      callback(result);
      if (!result.success) return;

      switch (method) {
        case 'read':
          socket.emit('rooms:read', result);
          break;
        case 'newPlayer':
          joinRoom(socket, userId, data);
          io.broadcast(`rooms:update`, result);
          break;
        case 'create':
          joinRoom(socket, userId, result.result.id);
        // no break!!! - cos default should be executed too!!!
        default:
          io.broadcast(`rooms:${method}`, result);
      }
    });

    socket.on('disconnect', function() {
      if (socket.session && socket.session.user) {
        log.warn(`${socket.session.user.email} disconnected`);
        socket.broadcast.emit('user:disconnected', socket.session.user.email);

        userSessionSocket.delSocketId(socket.session.user.id);
        socket.session = null;
      } else {
        log.warn(`Unlogined user disconnected`);
      }
    });
  });
}
module.exports = { io, carcaSockets };
