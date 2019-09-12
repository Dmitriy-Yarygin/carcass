const cookie = require('cookie');
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
// const io = new IO();

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
        // here needs to send message to all players in the room except userId
        socket.to(`room${roomId}`).emit('game: next turn', result);
      }
    );

    socket.on('rooms', async ({ method, data }, callback) => {
      // log.info(`Server rooms:${method} >>> %O`, data);
      const userId = socket.session.user.id;
      const result = await roomsManager[method](data, userId);
      log.verbose(`result = await roomsManager.${method}() >>> %O`, result);
      callback(result);
      if (!result.success) return;
      // const roomNick = result.result && result.result.id ? `room #${result.result.id}` : '';
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
