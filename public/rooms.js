socket.on('rooms', (rooms) => {
    const roomsDiv = document.getElementById('rooms');
    roomsDiv.innerHTML = '';
    for (let room of rooms) {
        const roomDiv = document.createElement('div');
        roomDiv.textContent = room;
        const joinButton = document.createElement('button');
        joinButton.textContent = 'Join';
        joinButton.addEventListener('click', () => {
            socket.emit('joinRoom', { username: 'Your username here', room });
        });
        roomDiv.appendChild(joinButton);
        roomsDiv.appendChild(roomDiv);
    }
});