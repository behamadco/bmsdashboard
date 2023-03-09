import { getAllDevices, getAllNotification } from "../js/Functions.js";

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

var touchkeys = [
    "TOUCHKEY",
    "TOUCHKEY_2B",
    "TOUCHKEY_3B",
    "TOUCHKEY_4B",
    "TOUCHKEY_16B",
    "SOCKET",
    "DIMMER",
    "COOLER_KEY"
];

var sensors = [
    "FLOWERPOT",
    "SENSOR",
    "IR",
    "MOTIONDETECTOR",
    "THERMOSTAT",
    "HEIGHTDETECTOR",
    "WINDOW_DOORSENSOR",
];

var actuators = [
    "BUZZER",
    "LOCK",
    "VALVE",
    "CURTAIN",
];

var uuid = sessionStorage.getItem("uuid");
var token = sessionStorage.getItem("token");

var notificationDiv = document.getElementById("notificationDiv");

var socketDeviceDiv = document.getElementById("socketDeviceDiv");
var actuatorsDeviceDiv = document.getElementById("actuatorsDeviceDiv");
var sensorsDeviceDiv = document.getElementById("sensorDeviceDiv");
var spinner = document.getElementById("spinner");

getAllNotification(uuid,token).then(res =>{
    for(var index in res["data"]){
        notificationDiv.innerHTML += "<a href='#' class='dropdown-item'><h6 class='fw-normal mb-0'>" + res["data"][index]["subject"] + "</h6></a><hr class='dropdown-divider'>"
    }
    notificationDiv.innerHTML += "<a href='#' class='dropdown-item text-center'>دیدن همه اطلاعیه ها</a>"
});

getAllDevices(uuid,token).then(res=>{
    for(var index in res["data"]){
        if(touchkeys.includes(res["data"][index]["type"])){
            socketDeviceDiv.innerHTML += "<div class='col-sm-3 col-xl-3 section'><a href=''><div class='bg-secondary rounded d-flex align-items-center justify-content-between p-4'><img class='device-icon' src=" + deviceIcon[res["data"][index]["type"]] + " alt=''><div class='ms-3'><h6 class='mb-0'>"+ res["data"][index]["name"] +"</h6></div></div></a></div>"
        }

        else if(actuators.includes(res["data"][index]["type"])){
            actuatorsDeviceDiv.innerHTML += "<div class='col-sm-3 col-xl-3 section'><a href=''><div class='bg-secondary rounded d-flex align-items-center justify-content-between p-4'><img class='device-icon' src=" + deviceIcon[res["data"][index]["type"]] + " alt=''><div class='ms-3'><h6 class='mb-0'>"+ res["data"][index]["name"] +"</h6></div></div></a></div>"
        }

        else if(sensors.includes(res["data"][index]["type"])){
            sensorsDeviceDiv.innerHTML += "<div class='col-sm-3 col-xl-3 section'><a href=''><div class='bg-secondary rounded d-flex align-items-center justify-content-between p-4'><img class='device-icon' src=" + deviceIcon[res["data"][index]["type"]] + " alt=''><div class='ms-3'><h6 class='mb-0'>"+ res["data"][index]["name"] +"</h6></div></div></a></div>"
        }
    }
    spinner.classList.remove("show");
});