
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
    document.getElementById("gamemode").value.display = "Battleroyale";
  } else {
    multi.style.display = "block";
  }
}