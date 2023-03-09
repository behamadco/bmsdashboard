import { getAllDevices, getAllNotification, getAllScenarios, getBuildings, getLastLogin, getQuickAccessDevices } from "../js/Functions.js";

var deviceIcon = {
    "BUZZER":"/img/buzzer.png",
    "COOLER_KEY":"/img/air-cooler.png",
    "FLOWERPOT": "/img/moisture.png",
    "SENSOR": "/img/carbon-monoxide.png",
    "IR": "/img/infrared.png",
    "LOCK": "/img/lock.png",
    "MOTIONDETECTOR": "/img/pir.png",
    "POWER": "/img/power-meter.png",
    "SOCKET": "/img/socket.png",
    "THERMOSTAT": "/img/thermostat.png",
    "TOUCHKEY": "/img/light-bulb.png",
    "TOUCHKEY_2B": "/img/light-bulb.png",
    "TOUCHKEY_3B": "/img/light-bulb.png",
    "TOUCHKEY_4B": "/img/light-bulb.png",
    "TOUCHKEY_16B": "/img/light-bulb.png",
    "VALVE": "/img/valve.png",
    "HEIGHTDETECTOR": "/img/height.png",
    "WINDOW_DOORSENSOR": "/img/window.png",
    "CURTAIN": "/img/curtain.png",
    "DIMMER":"/img/dimmer.png",
};


var uuid = sessionStorage.getItem("uuid");
var token = sessionStorage.getItem("token");
var username = sessionStorage.getItem("username");

var deviceCount = document.getElementById("deviceCount");
var buildingCount = document.getElementById("buildingCount");
var lastIp = document.getElementById("lastIp");
var notificationDiv = document.getElementById("notificationDiv");
var scenarioDiv = document.getElementById("scenarioDiv");
var quickAccessDiv = document.getElementById("quickAccessDiv");
var usernameElement = document.getElementById("username");


usernameElement.innerHTML = username;

getAllDevices(uuid,token).then(res => console.log(deviceCount.innerHTML=res["data"].length));
getBuildings(uuid,token).then(res => buildingCount.innerHTML=res["data"].length);
getLastLogin(uuid,token).then(res =>{
    lastIp.innerHTML = res["data"]["ipaddress"];
});
getAllNotification(uuid,token).then(res =>{
    for(var index in res["data"]){
        notificationDiv.innerHTML += "<a href='#' class='dropdown-item'><h6 class='fw-normal mb-0'>" + res["data"][index]["subject"] + "</h6></a><hr class='dropdown-divider'>"
    }
    notificationDiv.innerHTML += "<a href='#' class='dropdown-item text-center'>دیدن همه اطلاعیه ها</a>"
});

getAllScenarios(uuid,token).then(res => {
    for(var index in res["data"]){
        scenarioDiv.innerHTML += "<div class='d-flex align-items-center border-bottom py-3'><i class='fa fa-plug fa-3x text-info'></i><div class='w-100 ms-3'><div class='d-flex w-100 justify-content-between'><h6 class='mb-0 scenario-name'>"+ res["data"][index]["name"] +"</h6></div><span></span></div></div>";
    }
});

getQuickAccessDevices(uuid,token).then(res => {
    for(var index in res["data"]){
        quickAccessDiv.innerHTML += "<a href=''><div class='d-flex align-items-center border-bottom py-3'><img class='dashboard-icon' src="+ deviceIcon[res["data"][index]["type"]] +" alt=''><div class='w-100 ms-3'><div class='d-flex w-100 justify-content-between'><h6 class='mb-0 item-header'>"+ res["data"][index]["name"] +"</h6></div></div></div></a>";
    }
    spinner.classList.remove("show");
});