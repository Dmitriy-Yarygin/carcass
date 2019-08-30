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
    log.silly('socket.handshake >>>>>>>>>>>> ');
    // log.verbose(`socket.id = ${socket.id}`);

    const cookiesObj = cookie.parse(socket.handshake.headers.cookie);
    const { carcass_session } = cookiesObj;
    socket.session = await redisStore.get(carcass_session);

    if (!socket.session || !socket.session.user) {
      log.warn('User should login!');
      socket.disconnect(true);
    } else {
      socket.broadcast.emit('user:connected', socket.session.user);
      log.warn(`${socket.session.user.email} connected`);
    }

    // socket.on('user:login', async data => {
    //   log.info(`Server recieved on user:login >>> %O`, data);
    //   const res = await usersManager.login(data);
    //   socket.emit('user:login', res);
    // });

    socket.on('rooms:get', async data => {
      log.info(`Server recieved: %O`, data);
      log.verbose('User: %O', socket.session.user);

      const rooms = await roomsManager.read();
      socket.emit('rooms:get', rooms);
    });

    socket.on('rooms:post', async obj => {
      log.info('Server rooms:post: ', obj);
      const room = await roomsManager.create(obj, 'userId');
      socket.join(room.name, () => {
        let rooms = Object.keys(socket.rooms);
        log.info(rooms); // [ <socket.id>, 'room 237' ]
      });
      socket.emit('rooms:post', room);
    });

    socket.on('disconnect', function() {
      if (socket.session && socket.session.user && socket.session.user.email) {
        log.warn(`${socket.session.user.email} disconnected`);
        socket.broadcast.emit('user:disconnected', socket.session.user);
      } else {
        log.warn(`Unlogined user disconnected`);
      }
    });
  });
}
module.exports = carcaSockets;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// to one room
// socket.to('others').emit('an event', { some: 'data' });

// to multiple rooms
// socket.to('room1').to('room2').emit('hello');

// a private message to another socket
// socket.to(/* another socket id */).emit('hey');

// WARNING: `socket.to(socket.id).emit()` will NOT work, as it will send to everyone in the room
// named `socket.id` but the sender. Please use the classic `socket.emit()` instead.
