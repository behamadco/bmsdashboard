import { getAllDevices, getAllNotification, getAllScenarios, getBuildings, getLastLogin, getQuickAccessDevices, getSchedules, getAllSecurityScenarios, getAllTravelScenario } from "../js/Functions.js";

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

if(sessionStorage.getItem("uuid")==null){
    location.replace("/login");
}else{
    getAllNotification(uuid,token).then(res =>{
        fetch("/publicComponents/notificationRow.html").then(componentResponse=>componentResponse.text().then(notificationHtml=>{
            for(var index in res["data"]){
                notificationDiv.innerHTML += notificationHtml.replace("#notificationText",res["data"][index]["subject"]);
            }
        })).finally(()=>{notificationDiv.innerHTML += "<a href='#' class='dropdown-item text-center'>دیدن همه اطلاعیه ها</a>"});
    });
    


    getAllScenarios(uuid, token).then(getAllScenariosResponse=>{
        var scenarioData = getAllScenariosResponse["data"];
        fetch("components/scenariosComponent.html").then(componentResponse=>{componentResponse.text().then(scenarioHtml=>{
            var lastIndex;
            if(scenarioData.length < 3){lastIndex=scenarioData.length;}else{lastIndex=3;}
            for(var index=0;index<lastIndex;index++){
                var currentScenario = scenarioData[index];
                scenarioDiv.insertAdjacentHTML("beforeend",scenarioHtml.replace("#scImg",deviceIcon[currentScenario["sourcedevice"]["type"]]).replace("#scenarioName",currentScenario["name"]));
            }
        })});
    });
    
    getQuickAccessDevices(uuid,token).then(res => {
        fetch("components/quickAccessComponent.html").then(componentResponse=>componentResponse.text().then(quickAccessHtml=>{
            for(var index in res["data"]){
                quickAccessDiv.innerHTML += quickAccessHtml.replace("#imageSrc",deviceIcon[res["data"][index]["type"]]).replace("#deviceName",res["data"][index]["name"])
            }
        }));
        spinner.classList.remove("show");
    });
}