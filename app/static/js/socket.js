const socket = io();

socket.on('connect', () => {
  socket.emit('join', {});
});

socket.on('message', (data) => {
  console.log('received message: ' + data);
});