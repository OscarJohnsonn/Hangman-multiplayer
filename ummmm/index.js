const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io logic
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle setting username
    socket.on('setUsername', (username) => {
        socket.username = username;
    });

    // Handle selecting game mode
    socket.on('selectGameMode', (mode) => {
        socket.gamemode = mode;
    });

    // Handle hosting a game
    socket.on('hostGame', () => {
        // Generate a unique room code (for simplicity, you can use a library like shortid)
        const roomCode = 'ABC123'; // Replace with actual room code generation logic
        socket.join(roomCode);
        socket.emit('redirect', `host.html?room=${roomCode}`);
    });

    // Handle joining a game
    socket.on('joinGame', (roomCode) => {
        socket.join(roomCode);
        socket.emit('redirect', `game.html?room=${roomCode}`);
    });

    // Handle single player game
    socket.on('startSinglePlayer', () => {
        socket.emit('redirect', 'singleplayer.html');
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
