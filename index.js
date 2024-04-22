const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path'); // Required for resolving file paths

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let games = {};
let users = {};

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('a user connected');

    // Store user with their unique id (socket.id) and username
    socket.on('new user', (username) => {
        users[socket.id] = username;
        console.log('new user:', username);
    });

    // Disconnect user if they decide to play single player
    socket.on('single player', () => {
        socket.disconnect();
        console.log('single player:', socket.id);
    });

    socket.on('create game', (username) => {
        let gameId = generateGameId();
        games[gameId] = new Game(username, socket.id);
        socket.join(gameId);
        socket.emit('game created', gameId);
        console.log('create game:', gameId);
    });

    socket.on('join game', (gameId) => {
        let game = games[gameId];
        if (game) {
            let success = game.addPlayer(users[socket.id], socket.id);
            if (success) {
                socket.join(gameId);
                io.to(gameId).emit('game start', game);
                console.log('join game:', gameId);
            } else {
                socket.emit('join game error', 'Game is full');
                console.log('join game error: Game is full');
            }
        } else {
            socket.emit('join game error', 'Game not found');
            console.log('join game error: Game not found');
        }
    });

    socket.on('game over', (gameId) => {
        delete games[gameId];
        io.to(gameId).emit('game over');
        console.log('game over:', gameId);
    });

    // Move this inside the 'connection' event callback
    socket.on('redirect', (url) => {
        socket.emit('redirect', url);
        console.log('redirect:', url);
    });

    // Additional event handling can be added here as needed...
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});

function generateGameId() {
    return Math.random().toString(36).substring(2, 15);
}

class Game {
    constructor(player1, socketId1) {
        this.players = [{ username: player1, socketId: socketId1 }];
        // You can initialize game state here if needed
    }

    addPlayer(player, socketId) {
        if (this.players.length < 100) {
            this.players.push({ username: player, socketId: socketId });
            return true;
        } else {
            return false;
        }
    }
}
