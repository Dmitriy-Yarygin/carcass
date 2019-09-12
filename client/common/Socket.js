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

  socket.on('disconnect', reason => {
    console.log(` DISCONNECT `, reason);
    storeFunctions.setFlag(socket.connected);
    if (reason !== 'transport close') {
      // if (reason === 'io server disconnect')
      storeFunctions.logout();
    }
  });

  socket.on('user:connected', user => {
    console.log(` CONNECT %O`, user);
  });
  socket.on('user:disconnected', user => {
    console.log(` DISCONNECT %O`, user);
  });

  socket.on('newPlayer', user => {
    console.log(` >< Player enter ><`, user);
  });

  socket.on('rooms:create', answer => {
    storeFunctions.addRoom(answer.result);
  });
  socket.on('rooms:read', function(answer) {
    storeFunctions.loadRooms(answer.result);
  });
  socket.on('rooms:update', answer => {
    storeFunctions.updateRoom(answer.result);
  });
  socket.on('rooms:del', answer => {
    storeFunctions.delRoom(answer.id);
  });

  socket.on('game: next turn', answer => {
    console.log(answer);
  });
};
