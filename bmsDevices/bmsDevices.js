import { getAllBmsDevices, getAllNotification } from "../js/Functions.js";

var uuid = sessionStorage.getItem("uuid");
var token = sessionStorage.getItem("token");
var username = sessionStorage.getItem("username");

var bmsDeviceDiv = document.getElementById("bmsDeviceDiv");
var usernameElement = document.getElementById("username");
var spiiner = document.getElementById("spinner");

usernameElement.innerHTML = username;

getAllNotification(uuid,token).then(res =>{
    fetch("/publicComponents/notificationRow.html").then(componentResponse=>componentResponse.text().then(notificationHtml=>{
        for(var index in res["data"]){
            notificationDiv.innerHTML += notificationHtml.replace("#notificationText",res["data"][index]["subject"]);
        }
    })).finally(()=>{notificationDiv.innerHTML += "<a href='#' class='dropdown-item text-center'>دیدن همه اطلاعیه ها</a>"});
});

getAllBmsDevices(uuid,token).then(getAllBmsDevicesResponse=>{
    fetch("components/deviceRow.html").then(componentResponse=>componentResponse.text().then(bmsDeviceHtml=>{
        for(var index in getAllBmsDevicesResponse["data"]){
            bmsDeviceDiv.innerHTML += bmsDeviceHtml.replace("#devName",getAllBmsDevicesResponse["data"][index]["devname"]);
        }
    }));
    spinner.classList.remove("show");
});