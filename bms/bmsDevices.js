import { getAllBmsDevices, getAllNotification } from "../js/Functions.js";

var uuid = sessionStorage.getItem("uuid");
var token = sessionStorage.getItem("token");
var username = sessionStorage.getItem("username");

var bmsDeviceDiv = document.getElementById("bmsDeviceDiv");
var usernameElement = document.getElementById("username");
var spinner = document.getElementById("spinner");

usernameElement.innerHTML = username;

getAllNotification(uuid,token).then(res =>{
    fetch("/publicComponents/notificationRow.html").then(componentResponse=>componentResponse.text().then(notificationHtml=>{
        for(var index in res["data"]){
            notificationDiv.insertAdjacentHTML("beforeend", notificationHtml.replace("#notificationText",res["data"][index]["subject"]));
        }
    })).finally(()=>{notificationDiv.innerHTML += "<a href='#' class='dropdown-item text-center'>دیدن همه اطلاعیه ها</a>"});
});

getAllBmsDevices(uuid,token).then(getAllBmsDevicesResponse=>{
    fetch("components/deviceRow.html").then(componentResponse=>componentResponse.text().then(bmsDeviceHtml=>{
        var devicesElemenets = [];
        for(var index in getAllBmsDevicesResponse["data"]){
            bmsDeviceDiv.insertAdjacentHTML("beforeend",bmsDeviceHtml.replace("#devName",getAllBmsDevicesResponse["data"][index]["devname"]).replace("#devId",getAllBmsDevicesResponse["data"][index]["devEui"]));
            var eventListenerElemenet = document.getElementById(getAllBmsDevicesResponse["data"][index]["devEui"])
            if(eventListenerElemenet!=null){
                devicesElemenets.push(eventListenerElemenet);
            }
        }
        return devicesElemenets;

    })).then(elementResponse=>{
        elementResponse.forEach(function(element) {
            element.addEventListener("click",function(e){
                e.preventDefault();
                localStorage.setItem("bmsDevicePageDevEUI",this.getAttribute("id"))
                location.replace("/bmsDevice")
            },false);
        })
    });
    spinner.classList.remove("show");
});