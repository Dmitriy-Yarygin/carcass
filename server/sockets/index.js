const cookie = require('cookie');
const log = require('../helpers/logger')(__filename);
const roomsManager = require('../db/managers/rooms');
const usersManager = require('../db/managers/users');
const IO = require('koa-socket-2');
// class CarcaIO {
//   constructor() {
//     if (!CarcaIO.instance) {
//       CarcaIO.instance = new IO();
//     }
//     return CarcaIO.instance;
//   }
// }

// const io = new CarcaIO();
const io = new IO();

function carcaSockets(app, redisStore) {
  io.attach(app);
  io.on('connection', async socket => {
    /////////////////////////////////////////////////////////////////////////////////////////////
    log.info('socket.handshake >>>>>>>>>>>> ');
    if (socket.handshake.headers.cookie) {
      const cookiesObj = cookie.parse(socket.handshake.headers.cookie);
      log.error('======= cookiesObj ==========');
      log.silly(cookiesObj);

      const { carcass_session } = cookiesObj;
      log.error('======== carcass_session =========');
      log.silly(carcass_session);

      socket.session = await redisStore.get(carcass_session);
      log.warn(socket.session);
    } else log.error('======= cookie absent ==========');

    if (!socket.session || !socket.session.user) {
      log.warn('User should login!');
      socket.disconnect(true);
    } else {
      socket.broadcast.emit('user:connected', socket.session.user.email);
      log.warn(`${socket.session.user.email} connected`);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////

    // socket.on('user:login', async data => {
    //   log.info(`Server recieved on user:login >>> %O`, data);
    //   const res = await usersManager.login(data);
    //   socket.emit('user:login', res);
    // });

    socket.on('rooms', async ({ method, data }, callback) => {
      log.info(`Server rooms:${method} >>> %O`, data);
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
    /*
    socket.on('rooms:add', async (obj, callback) => {
      log.info('Server rooms:post >>> %O', obj);
      const result = await roomsManager.create(obj, socket.session.user.id);
      log.verbose(result);
      callback(result);
      if (!result.success) return;
      io.broadcast('rooms:add', result);
    });

    socket.on('rooms:update', async (obj, callback) => {
      log.info('Server rooms:update >>> %O', obj);
      log.silly(socket.session.user);
      const result = await roomsManager.update(obj, socket.session.user.id);
      log.verbose(result);
      callback(result);
      if (!result.success) return;
      io.broadcast('rooms:update', result);
    });

    socket.on('rooms:del', async (id, callback) => {
      log.info('Server rooms:del >>> id = ', id);
      const result = await roomsManager.del(id);
      // socket.join(room.name, () => {
      //   let rooms = Object.keys(socket.rooms);
      //   log.info(rooms); // [ <socket.id>, 'room 237' ]
      // });
      log.verbose(result);
      callback(result);
      if (!result.success) return;
      io.broadcast('rooms:del', id);
    });
*/
    socket.on('disconnect', function() {
      if (socket.session && socket.session.user && socket.session.user.email) {
        log.warn(`${socket.session.user.email} disconnected`);
        socket.broadcast.emit('user:disconnected', socket.session.user.email);
      } else {
        log.warn(`Unlogined user disconnected`);
      }
    });
  });
}
module.exports = { io, carcaSockets };

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// to one room
// socket.to('others').emit('an event', { some: 'data' });

// to multiple rooms
// socket.to('room1').to('room2').emit('hello');

// a private message to another socket
// socket.to(/* another socket id */).emit('hey');

// WARNING: `socket.to(socket.id).emit()` will NOT work, as it will send to everyone in the room
// named `socket.id` but the sender. Please use the classic `socket.emit()` instead.
