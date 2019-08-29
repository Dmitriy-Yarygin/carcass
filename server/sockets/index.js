const IO = require('koa-socket-2');
const io = new IO();

const roomsManager = require('../db/managers/rooms');

function carcaSockets(app) {
  io.attach(app);
  io.on('connection', socket => {
    console.log('socket.handshake >>>>>>>>>>>> ');
    // console.log(socket.handshake);

    // socket.on('message', (ctx, data) => {
    //   console.log('client sent data to message endpoint', data);
    //   console.log(ctx.socket.rooms);
    // });

    socket.on('giveRooms', async obj => {
      console.log('Server recieved: ', obj);
      const rooms = await roomsManager.read();
      socket.emit('roomsList', rooms);
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
