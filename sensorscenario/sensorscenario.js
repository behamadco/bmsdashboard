import { getAllDevices, getAllNotification } from "../js/Functions.js";

var uuid = sessionStorage.getItem("uuid");
var token = sessionStorage.getItem("token");


var sourceDeviceDiv = document.getElementById("sourceDeviceDiv");
var destinationDeviceDiv = document.getElementById("destinationDeviceDiv");

var destinationActionDiv = document.getElementById("destinationActionDiv");


var destinationBridge = document.getElementById("destinationBridge");

var thermostatSelector = document.getElementById("thermostatSelector");

var submitScenario = document.getElementById("submitScenario");

var setPoint = document.getElementById("setPoint");


var destinationDeviceName = "";

var selectedSourceDeviceType = "";
var selectedDestinationDeviceType = "";

var sourceDeviceName = "";

var sensorDevicesList = [];
var commandDevicesList = [];

var sensorDevices = ["THERMOSTAT","SENSOR","MOTIONDETECTOR"];
var commandDevices = ["BUZZER","COOLER_KEY","LOCK","SOCKET","TOUCHKEY","TOUCHKEY_2B","TOUCHKEY_3B","TOUCHKEY_4B","TOUCHKEY_16B","VALVE","CURTAIN","DIMMER"]


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
  
  
var touchkeys = [
    "COOLER_KEY",
    "TOUCHKEY",
    "TOUCHKEY_2B",
    "TOUCHKEY_3B",
    "TOUCHKEY_4B",
    "TOUCHKEY_16B"
];

var scenarioActionChoices = {
  "BUZZER":['روشن شود','خاموش شود'],
  "COOLER_KEY":["روشن شود","خاموش شود"],
  "LOCK":['باز شود',"بسته شود"],
  "RFID":['باز شود','بسته شود'],
  "SOCKET":["خاموش شود","روشن شود"],
  "TOUCHKEY":["خاموش شود","روشن شود"],
  "TOUCHKEY_2B":["خاموش شود","روشن شود"],
  "TOUCHKEY_3B":["خاموش شود","روشن شود"],
  "TOUCHKEY_4B":["خاموش شود","روشن شود"],
  "TOUCHKEY_16B":["خاموش شود","روشن شود"],
  "VALVE":["بسته شود","باز شود"],
  "CURTAIN":["بسته شود","باز شود"],
  "DIMMER":["خاموش شود","روشن شود"]
};

var thermostatItems = ["دما","رطوبت"];

var thermostatItemsKey = {
    "دما":"temperature",
    "رطوبت":"humidity"
}

var scenarioBridgeChoices = {
    "COOLER_KEY": ["دور کند", "دور تند"],
    "TOUCHKEY": ["پل اول"],
    "TOUCHKEY_2B":["پل اول","پل دوم"],
    "TOUCHKEY_3B":["پل اول","پل دوم","پل سوم"],
    "TOUCHKEY_4B":["پل اول","پل دوم","پل سوم","پل چهارم"],
    "TOUCHKEY_16B":["پل اول","پل دوم","پل سوم","پل چهارم","پل پنجم","پل ششم","پل هفتم","پل هشتم","پل نهم","پل دهم","پل یازدهم","پل دوازدهم","پل سیزدهم","پل چهاردهم","پل پانزدهم","پل شانزدهم"]
};

var commandDefinition = {
    "باز شود":1,
    "بسته شود":0,
    "روشن شود":1,
    "خاموش شود":0,
};

var sensorStatusKey = {
    "MOTIONDETECTOR":"status1",
    "SENSOR":"mq2",
    "THERMOSTAT":["temperature", "humidity"]
}

var deviceCommandDef = {
    "BUZZER":"command1",
    "LOCK":"command1",
    "RFID":"command1",
    "SOCKET":"command1",
    "VALVE":"command1",
    "CURTAIN":"command1",
    "DIMMER":"command1"
};
  
var bridgeCommandsDef = {
    "پل اول":"command1",
    "پل دوم":"command2",
    "پل سوم":"command3",
    "پل جهارم":"command4",
    "دور کند":"command2",
    "دور تند":"command3"
};


getAllNotification(uuid,token).then(res =>{
    fetch("/publicComponents/notificationRow.html").then(componentResponse=>componentResponse.text().then(notificationHtml=>{
        for(var index in res["data"]){
            notificationDiv.innerHTML += notificationHtml.replace("#notificationText",res["data"][index]["subject"]);
        }
    })).finally(()=>{notificationDiv.innerHTML += "<a href='#' class='dropdown-item text-center'>دیدن همه اطلاعیه ها</a>"});
});

getAllDevices(uuid, token).then(getAllDevicesResponse=>{
    fetch("components/deviceoption.html").then(deviceOptionResponse=>deviceOptionResponse.text().then(deviceOptionHtml=>{
        
        for(var index in getAllDevicesResponse["data"]){
            if(sensorDevices.includes(getAllDevicesResponse["data"][index]["type"])){
                sensorDevicesList.push(getAllDevicesResponse["data"][index]);
                sourceDeviceDiv.insertAdjacentHTML("beforeend",deviceOptionHtml.replace("#deviceValue",getAllDevicesResponse["data"][index]["id"]).replace("#deviceName",getAllDevicesResponse["data"][index]["name"]).replace("#deviceType",getAllDevicesResponse["data"][index]["type"]));
            }

            if(commandDevices.includes(getAllDevicesResponse["data"][index]["type"])){
                commandDevicesList.push(getAllDevicesResponse["data"][index]);
                destinationDeviceDiv.insertAdjacentHTML("beforeend",deviceOptionHtml.replace("#deviceValue",getAllDevicesResponse["data"][index]["id"]).replace("#deviceName",getAllDevicesResponse["data"][index]["name"]).replace("#deviceType",getAllDevicesResponse["data"][index]["type"]));
            }
        }

        var srcselectedOption = sourceDeviceDiv.options[sourceDeviceDiv.selectedIndex];
        var srcselectedDeviceType = srcselectedOption.getAttribute("device-type");
        sourceDeviceName = sourceDeviceDiv.text;
        selectedSourceDeviceType = srcselectedDeviceType;
        if(selectedSourceDeviceType=="THERMOSTAT"){
            thermostatSelector.style.display="block";
            thermostatSelector.innerHTML = "";
            for(var index in thermostatItems){
              var option = document.createElement("option");
              option.setAttribute("value",thermostatItemsKey[thermostatItems[index]]);
              option.text = thermostatItems[index];
              thermostatSelector.add(option);
            }
          }else{
            thermostatSelector.style.display="none";
          }

        sourceDeviceDiv.addEventListener("change",function(e) {
            e.preventDefault();
            var selectedOption = sourceDeviceDiv.options[sourceDeviceDiv.selectedIndex];
            var selectedDeviceType = selectedOption.getAttribute("device-type");
            selectedDestinationDeviceType = selectedDeviceType;
            sourceDeviceName = sourceDeviceDiv.text;
            if(selectedDeviceType=="THERMOSTAT"){
              thermostatSelector.style.display="block";
              thermostatSelector.innerHTML = "";
              for(var index in thermostatItems){
                var option = document.createElement("option");
                option.setAttribute("value",thermostatItemsKey[thermostatItems[index]]);
                option.text = thermostatItems[index];
                thermostatSelector.add(option);
              }
            }else{
              thermostatSelector.style.display="none";
            }
            for(var index in scenarioActionChoices[selectedDeviceType]){
              var option = document.createElement("option");
              option.setAttribute("value",commandDefinition[scenarioActionChoices[selectedDeviceType][index]]);
              option.text = scenarioActionChoices[selectedDeviceType][index];
              destinationActionDiv.add(option);
            }
          });

        var desselectedOption = destinationDeviceDiv.options[destinationDeviceDiv.selectedIndex];
        var desselectedDeviceType = desselectedOption.getAttribute("device-type");
        selectedDestinationDeviceType = desselectedDeviceType;
        destinationDeviceName = destinationDeviceDiv.text;
        destinationActionDiv.innerHTML="";
        for(var index in scenarioActionChoices[desselectedDeviceType]){
          var option = document.createElement("option");
          option.setAttribute("value",commandDefinition[scenarioActionChoices[desselectedDeviceType][index]]);
          option.text = scenarioActionChoices[desselectedDeviceType][index];
          destinationActionDiv.add(option);
        }
        if(touchkeys.includes(selectedDestinationDeviceType)){
            destinationBridge.style.display="block";
            destinationBridge.innerHTML = "";
            for(var index in scenarioBridgeChoices[selectedDestinationDeviceType]){
              var option = document.createElement("option");
              option.setAttribute("value",bridgeCommandsDef[scenarioBridgeChoices[selectedDestinationDeviceType][index]]);
              option.text = scenarioBridgeChoices[selectedDestinationDeviceType][index];
              destinationBridge.add(option);
            }
          }else{
            destinationBridge.style.display="none";
          }



        destinationDeviceDiv.addEventListener("change",function(e) {
            e.preventDefault();
            var selectedOption = destinationDeviceDiv.options[destinationDeviceDiv.selectedIndex];
            var selectedDeviceType = selectedOption.getAttribute("device-type");
            selectedDestinationDeviceType = selectedDeviceType;
            destinationDeviceName = destinationDeviceDiv.text;
            destinationActionDiv.innerHTML="";
            if(touchkeys.includes(selectedDeviceType)){
              destinationBridge.style.display="block";
              destinationBridge.innerHTML = "";
              for(var index in scenarioBridgeChoices[selectedDeviceType]){
                var option = document.createElement("option");
                option.setAttribute("value",bridgeCommandsDef[scenarioBridgeChoices[selectedDeviceType][index]]);
                option.text = scenarioBridgeChoices[selectedDeviceType][index];
                destinationBridge.add(option);
              }
            }else{
              destinationBridge.style.display="none";
            }
            for(var index in scenarioActionChoices[selectedDeviceType]){
              var option = document.createElement("option");
              option.setAttribute("value",commandDefinition[scenarioActionChoices[selectedDeviceType][index]]);
              option.text = scenarioActionChoices[selectedDeviceType][index];
              destinationActionDiv.add(option);
            }
          });

          submitScenario.addEventListener("click",function(e){
            e.preventDefault();

            scenarioPayload.scenarioName = ""

            if(touchkeys.includes(selectedDestinationDeviceType)){
                scenarioPayload.scenarioDestinationKey = destinationBridge.value;
            }else{
                scenarioPayload.scenarioDestinationKey = "command1"; 
            }

            if(!setPoint.value==''){
                scenarioPayload.scenarioSetPoint = setPoint.value;
            }

            if(selectedSourceDeviceType=="THERMOSTAT"){
                scenarioPayload.scenarioSourceKey = thermostatSelector.value;
            }

            scenarioPayload.scenarioSourceDevice = sourceDeviceDiv.value;
            scenarioPayload.scenarioDestinationDevice = destinationDeviceDiv.value;

            scenarioPayload.scenarioCommand = destinationActionDiv.value;

            console.log(scenarioPayload);
          });
    }))
}).finally(()=>{
    spinner.classList.remove("show");
});