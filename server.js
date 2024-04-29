const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let rooms = {};

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', (data) => {
        let room = rooms[data.room];
        if (!room) {
            room = rooms[data.room] = { users: {}, scores: {} };
        }
        room.users[socket.id] = data.username;
        room.scores[data.username] = 0;
        socket.join(data.room);
        io.to(data.room).emit('updateScores', room.scores);
    });

    socket.on('guessLetter', (data) => {
        // Here you would include the game logic for guessing a letter
        // If the guess is correct, increase the user's score
        let room = rooms[data.room];
        if (room) {
            room.scores[room.users[socket.id]] += data.score;
            io.to(data.room).emit('updateScores', room.scores);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        for (let room in rooms) {
            if (rooms[room].users[socket.id]) {
                delete rooms[room].users[socket.id];
                if (Object.keys(rooms[room].users).length === 0) {
                    delete rooms[room];
                } else {
                    io.to(room).emit('updateScores', rooms[room].scores);
                }
            }
        }
    });
});

server.listen(3000, () => console.log('Listening on port 3000'));