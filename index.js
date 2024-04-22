const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let games = {};


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });
  
  app.get('/leaderboard', (req, res) => {
    res.sendFile(__dirname + '/leaderboard.html');
  });
  
  app.get('/game.html', (req, res) => {
    res.sendFile(__dirname + '/game.html');
  });
  app.get('/host.html', (req, res) => {
    res.sendFile(__dirname + '/host.html');
  });


io.on('connection', (socket) => {
  socket.on('new game', (username) => {
    let gameId = generateGameId();
    games[gameId] = new Game(gameId, username, socket.id);
    socket.join(gameId);
    socket.emit('game created', gameId);
  });

  socket.on('join game', (gameId, username) => {
    let game = games[gameId];
    if (game && !game.player2) {
      game.addPlayer2(username, socket.id);
      io.to(gameId).emit('game start', game);
    } else {
      socket.emit('join game error');
    }
  });

  socket.on('guess', (gameId, guess) => {
    let game = games[gameId];
    if (game) {
      game.makeGuess(guess);
      io.to(gameId).emit('game update', game);
    }
  });

  socket.on('game over', (gameId) => {
    delete games[gameId];
    io.to(gameId).emit('game over');
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

function generateGameId() {
  return Math.random().toString(36).substring(2, 15);
}

class Game {
  // Implement the Game class here
}