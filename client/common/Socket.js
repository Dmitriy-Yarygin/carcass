import io from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', function(event) {
  console.log('Connected, event.numConnections = ', event);
});

socket.on('disconnect', function() {
  console.log('Disconnected');
});

export const socketEmit = (msgName, data) => {
  console.log(`socketEmit ${msgName}, %O`, data);
  socket.emit(msgName, data);
};

export const socketOn = (eventName, f = console.log) => {
  console.log(`socketOn ${eventName}`);
  socket.on(eventName, f);
};
