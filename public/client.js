const socket = io();

document.getElementById('join').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const room = document.getElementById('room').value;
    socket.emit('joinRoom', { username, room });
});

document.getElementById('guess').addEventListener('submit', (event) => {
    event.preventDefault();
    const letter = document.getElementById('letter').value;
    const room = document.getElementById('room').value;
    socket.emit('guessLetter', { letter, room });
});

socket.on('updateScores', (scores) => {
    const scoresDiv = document.getElementById('scores');
    scoresDiv.innerHTML = '';
    for (let username in scores) {
        const scoreDiv = document.createElement('div');
        scoreDiv.textContent = `${username}: ${scores[username]}`;
        scoresDiv.appendChild(scoreDiv);
    }
});
// Here you would include the game logic for guessing a letter
// When the user guesses a letter, emit a 'guessLetter' event
// socket.emit('guessLetter', { letter: 'a', room: 'room1' });

document.getElementById('guess').addEventListener('submit', (event) => {
    event.preventDefault();
    const letter = document.getElementById('letter').value;
    const room = document.getElementById('room').value;
    guessLetter(letter); // Call the guessLetter function here
    socket.emit('guessLetter', { letter, room, guessedLetters }); // Include guessedLetters when emitting the 'guessLetter' event
});

let guessedLetters = [];

function guessLetter(letter) {
    if (!guessedLetters.includes(letter)) {
        guessedLetters.push(letter);
        socket.emit('guessLetter', { room: 'room1', letter, guessedLetters });

        // Update the guessedLetters div
        document.getElementById('guessedLetters').textContent = 'Guessed letters: ' + guessedLetters.join(', ');
    } else {
        console.log(`You have already guessed the letter ${letter}`);
    }
}
