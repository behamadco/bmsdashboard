var deleteDeviceButton = document.getElementById('deleteDevice');
var modifyDeviceButton = document.getElementById('modifyDevice');
var updatSketchDeviceButton = document.getElementById('updateSketch');
var deleteModal = document.getElementById('deleteModal');
var submitDeleteButton = document.getElementById('submitDeleteButton');
var deleteModalClose = document.getElementById('deleteModalClose');

var canecelDeleteButton = document.getElementById('cancelDeleteButton');

function deleteDevice(deviceid,userUuid,token){

    var url = "http://185.2.14.188/SmartHomeV3/deleteDevice";

    var httpClient = new XMLHttpRequest();
    httpClient.onreadystatechange = function(){
        if(this.readyState==4 & this.status==200){
            var responseInJson = JSON.parse(this.response);
            if(responseInJson['status']){
                location.reload();
            }else{

            }
        }
        else{
            
        }
    }
    var body = {
        "deviceid":deviceid,
        "useruuid":userUuid,
    }
    httpClient.open("POST",url,true);
    httpClient.setRequestHeader("Content-type", "application/json");
    httpClient.setRequestHeader("Authorization","Token "+token);
    httpClient.send(JSON.stringify(body));
}

deleteDeviceButton.addEventListener("click",function(e){
    e.preventDefault();
    deleteModal.style.display = "block";
});


deleteModalClose.addEventListener("click",function (e){
    e.preventDefault();
    deleteModal.style.display="none";
});

canecelDeleteButton.addEventListener("click",function(e){
    e.preventDefault();
    deleteModal.style.display="none"; 
});


window.onclick = function(event) {
    if (event.target == deleteModal) {
      deleteModal.style.display = "none";
    }
}
 