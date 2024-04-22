// index.js
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/leaderboard', (req, res) => {
  res.sendFile(__dirname + '/leaderboard.html');
});

app.get('/game.html', (req, res) => {
  res.sendFile(__dirname + '/game.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('new score', (data) => {
    console.log(`New score added: ${data.username}: ${data.score}`);
    io.emit('new score', data);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});