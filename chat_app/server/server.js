const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const cors = require('cors');
const PORT = 5000;
app.use(cors());
const io = new Server(server, { cors: { origin: '*' } });
io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on('message', (message) => {
    console.log(`Message received: ${message}`);
    io.emit('message', message);
  });
  socket.on('typing', () => {
    socket.broadcast.emit('typing', socket.id);
    console.log('user is typing', socket.id);
  });
  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
