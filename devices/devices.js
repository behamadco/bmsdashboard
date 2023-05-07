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
    "RFID":"/img/rfid.png"
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
    "RFID"
];

var uuid = sessionStorage.getItem("uuid");
var token = sessionStorage.getItem("token");

var notificationDiv = document.getElementById("notificationDiv");

var socketDeviceDiv = document.getElementById("socketDeviceDiv");
var actuatorsDeviceDiv = document.getElementById("actuatorsDeviceDiv");
var sensorsDeviceDiv = document.getElementById("sensorDeviceDiv");
var spinner = document.getElementById("spinner");

getAllNotification(uuid,token).then(res =>{
    fetch("/publicComponents/notificationRow.html").then(componentResponse=>componentResponse.text().then(notificationHtml=>{
        for(var index in res["data"]){
            notificationDiv.innerHTML += notificationHtml.replace("#notificationText",res["data"][index]["subject"]);
        }
    })).finally(()=>{notificationDiv.innerHTML += "<a href='#' class='dropdown-item text-center'>دیدن همه اطلاعیه ها</a>"});
});

getAllDevices(uuid,token).then(res=>{
    fetch("components/deviceRow.html").then(componentResponse=>componentResponse.text().then(deviceHtml=>{
        var devicesElemenets = [];
        for(var index in res["data"]){
            if(touchkeys.includes(res["data"][index]["type"])){
                socketDeviceDiv.insertAdjacentHTML("beforeend",deviceHtml.replace("#imageSrc",deviceIcon[res["data"][index]["type"]]).replace("#deviceName",res["data"][index]["name"]).replace("#deviceId",res["data"][index]["id"]));
            }
    
            else if(actuators.includes(res["data"][index]["type"])){
                console.log(res["data"][index]);
                actuatorsDeviceDiv.insertAdjacentHTML("beforeend",deviceHtml.replace("#imageSrc",deviceIcon[res["data"][index]["type"]]).replace("#deviceName",res["data"][index]["name"]).replace("#deviceId",res["data"][index]["id"]));
            }
    
            else if(sensors.includes(res["data"][index]["type"])){
                sensorsDeviceDiv.insertAdjacentHTML("beforeend",deviceHtml.replace("#imageSrc",deviceIcon[res["data"][index]["type"]]).replace("#deviceName",res["data"][index]["name"]).replace("#deviceId",res["data"][index]["id"]));
            }
            var eventListenerElemenet = document.getElementById(res["data"][index]["id"]);
            if(eventListenerElemenet!=null){
                devicesElemenets.push(eventListenerElemenet);
            }
        }

        return devicesElemenets;

    })).then(elemenetsResponse=>{
        elemenetsResponse.forEach(function(element){
            element.addEventListener("click",function(e){
                e.preventDefault();
                localStorage.setItem("devicePageDeviceId",this.getAttribute("id"));
                location.replace("/device")
            },false);
        });
    });
    spinner.classList.remove("show");
});

