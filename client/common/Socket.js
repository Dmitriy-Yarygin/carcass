import io from 'socket.io-client';

export const socket = io({
  transports: ['websocket']
});

export const socketListeners = storeFunctions => {
  socket.on('reconnect_attempt', () => {
    console.log(` trying reCONNECT `);
    socket.io.opts.transports = ['polling', 'websocket'];
  });

  socket.on('connect', () => {
    console.log(` CONNECT `);
    storeFunctions.setFlag(socket.connected);
  });

  socket.on('disconnect', () => {
    console.log(` DISCONNECT `);
    storeFunctions.setFlag(socket.connected);
  });

  socket.on('user:connected', user => {
    console.log(` CONNECT %O`, user);
  });
  socket.on('user:disconnected', user => {
    console.log(` DISCONNECT %O`, user);
  });

  socket.on('rooms:create', answer => {
    console.log('rooms:create >>> %O', answer);
    storeFunctions.addRoom(answer.result);
  });

  socket.on('rooms:read', function(answer) {
    // console.log('roomsList ', answer);
    console.log('ggggggggggggggggggggg');
    console.log(answer.result);
    storeFunctions.loadRooms(answer.result);
  });

  socket.on('rooms:update', answer => {
    console.log('rooms:update >>> %O', answer);
    storeFunctions.updateRoom(answer.result);
  });

  socket.on('rooms:del', answer => {
    console.log('rooms:del >>> ', answer);
    storeFunctions.delRoom(answer.id);
  });
};
