import io from 'socket.io-client';

const socket = io({
  transports: ['websocket']
});

socket.on('reconnect_attempt', () => {
  socket.io.opts.transports = ['polling', 'websocket'];
});

socket.on('connect', function(event) {
  console.log('Connected, event.numConnections = ', event);
});

socket.on('disconnect', function() {
  console.log('Disconnected');
});

socket.on('roomsList', function(data) {
  console.log('roomsList ', data);
});

// export const socketEmit = (msgName, data) => {
//   console.log(`socketEmit ${msgName}, %O`, data);
//   socket.emit(msgName, data);
// };

// export const socketOn = (eventName, f = console.log) => {
//   console.log(`socketOn ${eventName}`);
//   socket.on(eventName, f);
// };

export { socket };
