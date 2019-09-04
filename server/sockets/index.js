const cookie = require('cookie');
const log = require('../helpers/logger')(__filename);
const roomsManager = require('../db/managers/rooms');
const usersManager = require('../db/managers/users');
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

    socket.broadcast.emit('user:connected', socket.session.user);
    log.silly(`User connected >>>`);
    log.warn(socket.session.user);
    /////////////////////////////////////////////////////////////////////////////////////////////

    // socket.on('user:login', async data => {
    //   log.info(`Server recieved on user:login >>> %O`, data);
    //   const res = await usersManager.login(data);
    //   socket.emit('user:login', res);
    // });

    socket.on('rooms', async ({ method, data }, callback) => {
      // log.info(`Server rooms:${method} >>> %O`, data);
      const result = await roomsManager[method](data, socket.session.user.id);
      log.verbose(`result = await roomsManager.${method}() >>> %O`, result);
      callback(result);
      if (!result.success) return;
      switch (method) {
        case 'read':
          socket.emit('rooms:read', result);
          break;
        case 'newPlayer':
          io.broadcast(`rooms:update`, result);
          break;
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

// to one room
// socket.to('others').emit('an event', { some: 'data' });

// to multiple rooms
// socket.to('room1').to('room2').emit('hello');

// a private message to another socket
// socket.to(/* another socket id */).emit('hey');

// WARNING: `socket.to(socket.id).emit()` will NOT work, as it will send to everyone in the room
// named `socket.id` but the sender. Please use the classic `socket.emit()` instead.
