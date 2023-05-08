import { getAllDevices, getAllNotification, createScenario } from "../js/Functions.js";


var uuid = sessionStorage.getItem("uuid");
var token = sessionStorage.getItem("token");
var notificationDiv = document.getElementById("notificationDiv");

var sourceDeviceDiv = document.getElementById("sourceDeviceDiv");
var destinationDeviceDiv = document.getElementById("destinationDeviceDiv");


var sourceDeviceName = "";
var destinationDeviceName = "";

var selectedSourceDeviceType = "";
var selectedDestinationDeviceType = "";

var gasSensorDeviceList = [];
var valveDeviceList = [];

var spinner = document.getElementById("spinner");

var scenarioPayload = {
    "scenarioName":"",
    "scenarioCommand":"",
    "scenarioCondition":"NOTSET",
    "scenarioSourceDevice":"",
    "scenarioDestinationDevice":"",
    "scenarioSourceTopic":"",
    "scenarioDestinationTopic":"",
    "scenarioSourceKey":"",
    "scenarioDestinationKey":"",
    "scenarioSourceValue":"",
    "scenarioSetPoint":"NOTSET",
    "scenarioSms":0,
    "scenarioNotification":0,
    "scenarioStatus":1,
}


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
            if(getAllDevicesResponse["data"][index]["type"]=="SENSOR"){
                gasSensorDeviceList.push(getAllDevicesResponse["data"][index]);
                sourceDeviceDiv.insertAdjacentHTML("beforeend",deviceOptionHtml.replace("#deviceValue",getAllDevicesResponse["data"][index]["id"]).replace("#deviceName",getAllDevicesResponse["data"][index]["name"]).replace("#deviceType",getAllDevicesResponse["data"][index]["type"]));
            }
    
            if(getAllDevicesResponse["data"][index]["type"]=="VALVE"){
                valveDeviceList.push(getAllDevicesResponse["data"][index]);
                destinationDeviceDiv.insertAdjacentHTML("beforeend",deviceOptionHtml.replace("#deviceValue",getAllDevicesResponse["data"][index]["id"]).replace("#deviceName",getAllDevicesResponse["data"][index]["name"]).replace("#deviceType",getAllDevicesResponse["data"][index]["type"]));
            }
        }

        var desselectedOption = destinationDeviceDiv.options[destinationDeviceDiv.selectedIndex];
        var desselectedDeviceType = desselectedOption.getAttribute("device-type");
        selectedDestinationDeviceType = desselectedDeviceType;
        destinationDeviceName = desselectedOption.innerHTML;

        var srcselectedOption = sourceDeviceDiv.options[sourceDeviceDiv.selectedIndex];
        var srcselectedDeviceType = srcselectedOption.getAttribute("device-type");
        sourceDeviceName = srcselectedOption.innerHTML;
        selectedSourceDeviceType = srcselectedDeviceType;

        destinationDeviceDiv.addEventListener("change",function(e) {
          e.preventDefault();
          var selectedOption = destinationDeviceDiv.options[destinationDeviceDiv.selectedIndex];
          var selectedDeviceType = selectedOption.getAttribute("device-type");
          selectedDestinationDeviceType = selectedDeviceType;
          destinationDeviceName = selectedOption.innerHTML;
        });


        sourceDeviceDiv.addEventListener("change",function(e){
          e.preventDefault();
          var selectedOption = sourceDeviceDiv.options[sourceDeviceDiv.selectedIndex];
          var selectedDeviceType = selectedOption.getAttribute("device-type");
          selectedSourceDeviceType = selectedDeviceType;
          sourceDeviceName = selectedOption.innerHTML;
        });
        
        submitScenario.addEventListener("click", function(e){
          e.preventDefault();

          submitScenario.innerHTML = "در حال ثبت...";


          scenarioPayload.scenarioName = "سناریو دستگاه " + sourceDeviceName + " و " + destinationDeviceName;
          scenarioPayload.scenarioCommand = 0;
          scenarioPayload.scenarioCondition = ">";
          scenarioPayload.scenarioSourceKey = "mq2";
          scenarioPayload.scenarioSourceValue = "NOTSET";
          scenarioPayload.scenarioDestinationKey = "command1";
          scenarioPayload.scenarioSourceDevice = sourceDeviceDiv.value;
          scenarioPayload.scenarioDestinationDevice = destinationDeviceDiv.value;
          scenarioPayload.scenarioSetPoint = 1000;

            createScenario(
              scenarioPayload.scenarioName,
              scenarioPayload.scenarioCommand,
              scenarioPayload.scenarioCondition,
              scenarioPayload.scenarioSourceKey,
              scenarioPayload.scenarioSourceValue,
              scenarioPayload.scenarioDestinationKey,
              scenarioPayload.scenarioSourceDevice,
              scenarioPayload.scenarioSourceDevice,
              scenarioPayload.scenarioDestinationDevice,
              scenarioPayload.scenarioSetPoint,
              scenarioPayload.scenarioNotification,
              scenarioPayload.scenarioStatus,
              scenarioPayload.scenarioSms,
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