function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}




function togglemulti() {
  var multi = document.getElementById("multielements");
  if (multi.style.display === "block") {
    multi.style.display = "none";
    document.getElementById("gamemode").innerText = "Single Player";
    document.getElementById("drop").style.display = "block";
    document.getElementById("status").style.display = "none";
    document.getElementById("activerooms").style.display = "none";
    document.getElementById("socketid").style.display = "none";
    document.getElementById("roomcodeinput").style.display = "none";
    document.getElementById("playbtn").style.display = "block";
    document.getElementById("joinbtn").style.display = "none";
  } else {
    multi.style.display = "block";
    document.getElementById("gamemode").innerText = "Battle Royale";
    document.getElementById("drop").style.display = "none";
    document.getElementById("status").style.display = "block";
    document.getElementById("activerooms").style.display = "block";
    document.getElementById("playbtn").style.display = "none";
    document.getElementById("joinbtn").style.display = "block";
    document.getElementById("roomcodeinput").style.display = "block";
    document.getElementById("socketid").style.display = "block";
  }
}
function digitalClock() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    // Pad single digits with a leading zero
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    var time = hours + ":" + minutes + ":" + seconds;

    document.getElementById('time').innerText = time;

    setTimeout(digitalClock, 1000);
}

digitalClock();

window.onload = function() {
    fetchStatus();

};

function fetchStatus() {
    fetch('https://status.replit.com/api/v1/status', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            const statusDiv = document.getElementById('status');
            if (statusDiv) {
                statusDiv.innerHTML = `Status: ${data.page.state}`;
            } else {
                console.error('Error: status div not found');
            }
        })
        .catch(error => console.error('Error:', error));
}




const socket = io(); // Connect to the server

window.onload = function () {
    digitalClock(); // Start the digital clock
    fetchStatus(); // Fetch status information
    setUsername(); // Set the username
};

function setUsername() {
    let username = prompt("Enter your username");
    if (!username) {
        username = "Player" + Math.floor(Math.random() * 1000);
    }
    socket.emit('new user', username); // Emit the username to the server
}

function digitalClock() {
    // Your digital clock function remains the same
}

function fetchStatus() {
    fetch('https://status.replit.com/api/v1/status', { method: 'GET' })
        .then(response => response.json())
        .then(data => {
            const statusDiv = document.getElementById('status');
            if (statusDiv) {
                statusDiv.innerHTML = `Status: ${data.page.state}`;
            } else {
                console.error('Error: status div not found');
            }
        })
        .catch(error => console.error('Error:', error));
}

document.getElementById('togglemulti').addEventListener('change', () => {
    if (document.getElementById('togglemulti').checked) {
        document.getElementById('gamemode').innerText = 'Battle Royale';
    } else {
        document.getElementById('gamemode').innerText = 'Single Player';
    }
});

document.getElementById('playbtn').addEventListener('click', () => {
    socket.emit('single player'); // Emit 'single player' event when play button clicked
});

document.getElementById('hostbtn').addEventListener('click', () => {
    socket.emit('create game'); // Emit 'create game' event when host button clicked
});

document.getElementById('joinbtn').addEventListener('click', () => {
    let gameId = prompt("Enter the game ID");
    socket.emit('join game', gameId); // Emit 'join game' event with entered game ID
});

socket.on('game created', (gameId) => {
    console.log(`Game created with ID: ${gameId}`);
    // Handle UI updates or navigation as needed
});

socket.on('game start', (game) => {
    console.log(`Game started with players: ${game.players[0].username} and ${game.players[1].username}`);
    // Handle UI updates or navigation as needed
});

socket.on('join game error', (errorMessage) => {
    alert(`Error joining game: ${errorMessage}`);
});
