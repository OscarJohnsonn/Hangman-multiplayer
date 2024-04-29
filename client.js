const socket = io();

document.getElementById('join').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const room = document.getElementById('room').value;
    socket.emit('joinRoom', { username, room });
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