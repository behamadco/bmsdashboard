import { getAllDevices, getAllNotification, createScenario, codeGenerator, createSecurityScenario } from "../js/Functions.js";


var uuid = sessionStorage.getItem("uuid");
var token = sessionStorage.getItem("token");

var notificationDiv = document.getElementById("notificationDiv");

var alarmDeviceDiv = document.getElementById("alarmDevice");
var windowDeviceDiv = document.getElementById("windowDevice");
var pirDeviceDiv = document.getElementById("pirDevice");

var submitScenario = document.getElementById("submitScenario");

var alarmDeviceList = [];
var windowDeviceList = [];
var pirDeviceList = [];


var alarmDeviceName = "";
var windowDeviceName = "";
var pirDeviceName = "";

var securityCode = "";

var spinner = document.getElementById("spinner");

var scenarioPayload = {
    "scenarioName":"",
    "alarmDevice":"",
    "windowDevice":"",
    "pirDevice":"",
    "securityCode":"",
    "notifyMode":"both"
};

getAllNotification(uuid,token).then(res =>{
    fetch("/publicComponents/notificationRow.html").then(componentResponse=>componentResponse.text().then(notificationHtml=>{
        for(var index in res["data"]){
            notificationDiv.innerHTML += notificationHtml.replace("#notificationText",res["data"][index]["subject"]);
        }
    })).finally(()=>{notificationDiv.innerHTML += "<a href='#' class='dropdown-item text-center'>دیدن همه اطلاعیه ها</a>"});
});

getAllDevices(uuid,token).then(getAllDevicesResponse=>{
    fetch("components/deviceoption.html").then(deviceoptionResponse=>deviceoptionResponse.text().then(deviceOptionHtml=>{
        for(var index in getAllDevicesResponse["data"]){
            if(getAllDevicesResponse["data"][index]["type"]=="BUZZER"){
                alarmDeviceList.push(getAllDevicesResponse["data"][index]);
                alarmDeviceDiv.insertAdjacentHTML("beforeend",deviceOptionHtml.replace("#deviceValue",getAllDevicesResponse["data"][index]["id"]).replace("#deviceName",getAllDevicesResponse["data"][index]["name"]).replace("#deviceType",getAllDevicesResponse["data"][index]["type"]));
            }
    
            if(getAllDevicesResponse["data"][index]["type"]=="WINDOW_DOORSENSOR"){
                windowDeviceList.push(getAllDevicesResponse["data"][index]);
                windowDeviceDiv.insertAdjacentHTML("beforeend",deviceOptionHtml.replace("#deviceValue",getAllDevicesResponse["data"][index]["id"]).replace("#deviceName",getAllDevicesResponse["data"][index]["name"]).replace("#deviceType",getAllDevicesResponse["data"][index]["type"]));
            }

            if(getAllDevicesResponse["data"][index]["type"]=="MOTIONDETECTOR"){
                pirDeviceList.push(getAllDevicesResponse["data"][index]);
                pirDeviceDiv.insertAdjacentHTML("beforeend",deviceOptionHtml.replace("#deviceValue",getAllDevicesResponse["data"][index]["id"]).replace("#deviceName",getAllDevicesResponse["data"][index]["name"]).replace("#deviceType",getAllDevicesResponse["data"][index]["type"]));
            }
        }

        securityCode = codeGenerator(5);

        var securityCodeText = document.getElementById("securityCode");
        securityCodeText.innerHTML = securityCode;

        var alarmSelectedOption = alarmDeviceDiv.options[alarmDeviceDiv.selectedIndex];
        alarmDeviceName = alarmSelectedOption.innerHTML;

        var windowSelectedOption = windowDeviceDiv.options[windowDeviceDiv.selectedIndex];
        windowDeviceName = windowSelectedOption.innerHTML;

        var pirSelectedOption = pirDeviceDiv.options[pirDeviceDiv.selectedIndex];
        pirDeviceName = pirSelectedOption.innerHTML;

        alarmDeviceDiv.addEventListener("change",function(e){
            e.preventDefault();
            var alarmSelectedOption = alarmDeviceDiv.options[alarmDeviceDiv.selectedIndex];
            alarmDeviceName = alarmSelectedOption.innerHTML;
        });

        windowDeviceDiv.addEventListener("change",function(e){
            e.preventDefault();
            var windowSelectedOption = windowDeviceDiv.options[windowDeviceDiv.selectedIndex];
            windowDeviceName = windowSelectedOption.innerHTML;
        });

        pirDeviceDiv.addEventListener("change",function(e){
            e.preventDefault();
            var pirSelectedOption = pirDeviceDiv.options[pirDeviceDiv.selectedIndex];
            pirDeviceName = pirSelectedOption.innerHTML;
        });


        submitScenario.addEventListener("click", function(e){
          e.preventDefault();

          scenarioPayload.scenarioName = "سناریو امنیتی " + alarmDeviceName + " و " + windowDeviceName + " و " + pirDeviceName;
          scenarioPayload.alarmDevice = alarmDeviceDiv.value;
          scenarioPayload.windowDevice = windowDeviceDiv.value;
          scenarioPayload.pirDevice = pirDeviceDiv.value;
          scenarioPayload.notifyMode = "both";
          scenarioPayload.securityCode = securityCode;
        
          
          createSecurityScenario(
            scenarioPayload.scenarioName,
            scenarioPayload.alarmDevice,
            scenarioPayload.windowDevice,
            scenarioPayload.pirDevice,
            scenarioPayload.securityCode,
            uuid,
            token
            ).then(createScenarioResponse=>{
              if(createScenarioResponse.status){
                window.location.replace("/scenario");
              }else{
                submitScenario.innerHTML = "ثبت سناریو";
                console.log("SensorScenarioMessage",createScenarioResponse.message);
                var messageText = document.getElementById("messageText");
                messageText.innerHTML = "در ثبت سناریو خطا رخ داده است";
              }
            });
        });
    }));
}).finally(()=>{
  spinner.classList.remove("show");
});