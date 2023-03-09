var modal = document.getElementById('scenarioContent');
var close = document.getElementById('scenarioClose');


function showModal(name,sourceDevice,destinationDevice,scenarioStatus){
    modal.style.display="block";
    document.getElementById('scenarioName').innerHTML=name;
    document.getElementById('scenarioSourceDevice').innerHTML=sourceDevice;
    document.getElementById('scenarioDestinationDevice').innerHTML=destinationDevice;
    document.getElementById('scenarioStatus').innerHTML = scenarioStatus ? "فعال" : "غیر فعال";
    document.getElementById('scenarioStatus').style.color = scenarioStatus ? "green" : "red";
}

close.addEventListener("click",function (e){
    e.preventDefault();
    modal.style.display="none";
});


window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
}