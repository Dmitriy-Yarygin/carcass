import io from 'socket.io-client';

export const socket = io({
  transports: ['websocket']
});

export const socketListeners = setFlag => {
  socket.on('reconnect_attempt', () => {
    console.log(` trying reCONNECT `);
    socket.io.opts.transports = ['polling', 'websocket'];
  });

  socket.on('connect', () => {
    console.log(` CONNECT `);
    setFlag(socket.connected);
  });

  socket.on('disconnect', () => {
    console.log(` DISCONNECT `);
    setFlag(socket.connected);
  });

  socket.on('user:connected', user => {
    console.log(` CONNECT %O`, user);
  });
  socket.on('user:disconnected', user => {
    console.log(` DISCONNECT %O`, user);
  });

  socket.on('rooms:get', function(data) {
    console.log('roomsList ', data);
  });
};
