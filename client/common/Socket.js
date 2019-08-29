import io from 'socket.io-client';

export const socket = io({
  transports: ['websocket']
});

export const socketListeners = setFlag => {
  socket.on('reconnect_attempt', () => {
    socket.io.opts.transports = ['polling', 'websocket'];
  });

  socket.on('connect', () => {
    setFlag(socket.connected);
  });

  socket.on('disconnect', () => {
    setFlag(socket.connected);
  });

  socket.on('roomsList', function(data) {
    console.log('roomsList ', data);
  });
};
