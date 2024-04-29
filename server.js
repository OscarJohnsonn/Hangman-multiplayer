const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Read the file and split it into an array of words
const words = fs.readFileSync(path.join(__dirname, 'words.txt'), 'utf-8').split('\n');

// Function to get a random word
function getRandomWord() {
    const index = Math.floor(Math.random() * words.length);
    return words[index];
}

let rooms = {};

io.on('connection', (socket) => {
    console.log('New client connected');
    socket.emit('rooms', Object.keys(rooms));


    socket.on('joinRoom', (data) => {
        let room = rooms[data.room];
        if (!room) {
            const word = getRandomWord();
            room = rooms[data.room] = { users: {}, scores: {}, word };
            console.log(`New room created: ${data.room}. Word to guess: ${word}`);
        }
        room.users[socket.id] = data.username;
        room.scores[data.username] = 0;
        socket.join(data.room);
        io.to(data.room).emit('updateScores', room.scores);
    });

    socket.on('guessLetter', (data) => {
        let room = rooms[data.room];
        if (room) {
            let score = 0;
            // Check if the guessed letter is in the word
            if (room.word.includes(data.letter)) {
                // Increase the score by 2 for each occurrence of the letter
                for (let letter of room.word) {
                    if (letter === data.letter) {
                        score += 2;
                    }
                }
                room.scores[room.users[socket.id]] += score;
                // Check if the word has been fully guessed
                if (Array.isArray(data.guessedLetters) && room.word.split('').every(letter => data.guessedLetters.includes(letter))) {
                    // The word has been fully guessed, pick a new word
                    room.word = getRandomWord();
                    console.log(`New word for room ${data.room}: ${room.word}`);
                }
            }
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