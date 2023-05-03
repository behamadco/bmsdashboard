import { getAllDevices, getAllNotification } from "../js/Functions.js";

var uuid = sessionStorage.getItem("uuid");
var token = sessionStorage.getItem("token");

var notificationDiv = document.getElementById("notificationDiv");

var sourceDeviceDiv = document.getElementById("sourceDeviceDiv");
var destinationDeviceDiv = document.getElementById("destinationDeviceDiv");

var sourceActionDiv = document.getElementById("sourceActionDiv");
var destinationActionDiv = document.getElementById("destinationActionDiv");

var sourceBridge = document.getElementById("sourceBridge");
var destinationBridge = document.getElementById("destinationBridge");

var submitScenario = document.getElementById("submitScenario");


var commandDeviceList = [];
var statusDeviceList = [];


var sourceDeviceName = "";
var destinationDeviceName = "";

var selectedSourceDeviceType = "";
var selectedDestinationDeviceType = "";

var commandDevices = ["BUZZER","COOLER_KEY","LOCK","SOCKET","TOUCHKEY","TOUCHKEY_2B","TOUCHKEY_3B","TOUCHKEY_4B","TOUCHKEY_16B","VALVE","CURTAIN","DIMMER"]
var statusDevices = ["BUZZER","COOLER_KEY","SOCKET","TOUCHKEY","TOUCHKEY_2B","TOUCHKEY_3B","TOUCHKEY_4B","TOUCHKEY_16B","VALVE","WINDOW_DOORSENSOR","DIMMER","MOTIONDETECTOR"];


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
  
var scenarioStatusChoices = {
    "BUZZER":["روشن شد","خاموش شد"],
    "COOLER_KEY":["روشن شد","خاموش شد"],
    "SENSOR":["کم خطر","پر خطر","خطرناک"],
    "SOCKET":["روشن شد","خاموش شد"],
    "TOUCHKEY":["روشن شد","خاموش شد"],
    "TOUCHKEY_2B":["روشن شد","خاموش شد"],
    "TOUCHKEY_3B":["روشن شد","خاموش شد"],
    "TOUCHKEY_4B":["روشن شد","خاموش شد"],
    "TOUCHKEY_16B":["روشن شد","خاموش شد"],
    "VALVE":["باز شد","بسته شد"],
    "WINDOW_DOORSENSOR":["باز شد","بسته شد"],
    "MOTIONDETECTOR":["تردد تشخیص داد"],
    "DIMMER":["خاموش شد","روشن شد"]
  };
  
  
  
var scenarioBridgeChoices = {
    "COOLER_KEY": ["دور کند", "دور تند"],
    "TOUCHKEY": ["پل اول"],
    "TOUCHKEY_2B":["پل اول","پل دوم"],
    "TOUCHKEY_3B":["پل اول","پل دوم","پل سوم"],
    "TOUCHKEY_4B":["پل اول","پل دوم","پل سوم","پل چهارم"],
    "TOUCHKEY_16B":["پل اول","پل دوم","پل سوم","پل چهارم","پل پنجم","پل ششم","پل هفتم","پل هشتم","پل نهم","پل دهم","پل یازدهم","پل دوازدهم","پل سیزدهم","پل چهاردهم","پل پانزدهم","پل شانزدهم"]
  };
  
var statusDefinition = {
    "خاموش شد":false,
    "بسته شد":false,
    "روشن شد":true,
    "باز شد":true,
    "تردد تشخیص داد":true,
  };
  
var commandDefinition = {
    "باز شود":1,
    "بسته شود":0,
    "روشن شود":1,
    "خاموش شود":0,
};
  
var bridgeDefinition = {
    "پل اول":"status1",
    "پل دوم":"status2",
    "پل سوم":"status3",
    "پل چهارم":"status4",
    "دور کند":"status2",
    "دور تند":"status3"
  };
  
  
var deviceStatusDef = {
    "BUZZER":"status1",
    "SENSOR":"mq2",
    "MOTIONDETECTOR":"status1",
    "SOCKET":"status1",
    "VALVE":"status1",
    "WINDOW_DOORSENSOR":"status1",
    "DIMMER":"status1"
  };
  
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

getAllDevices(uuid,token).then(getAllDevicesResponse=>{
    fetch("components/deviceoption.html").then(deviceoptionResponse=>deviceoptionResponse.text().then(deviceOptionHtml=>{
        for(var index in getAllDevicesResponse["data"]){
            if(commandDevices.includes(getAllDevicesResponse["data"][index]["type"])){
                commandDeviceList.push(getAllDevicesResponse["data"][index]);
                destinationDeviceDiv.insertAdjacentHTML("beforeend",deviceOptionHtml.replace("#deviceValue",getAllDevicesResponse["data"][index]["id"]).replace("#deviceName",getAllDevicesResponse["data"][index]["name"]).replace("#deviceType",getAllDevicesResponse["data"][index]["type"]));
            }
    
            if(statusDevices.includes(getAllDevicesResponse["data"][index]["type"])){
                statusDeviceList.push(getAllDevicesResponse["data"][index]);
                sourceDeviceDiv.insertAdjacentHTML("beforeend",deviceOptionHtml.replace("#deviceValue",getAllDevicesResponse["data"][index]["id"]).replace("#deviceName",getAllDevicesResponse["data"][index]["name"]).replace("#deviceType",getAllDevicesResponse["data"][index]["type"]));
            }
        }

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

        



        var srcselectedOption = sourceDeviceDiv.options[sourceDeviceDiv.selectedIndex];
        var srcselectedDeviceType = srcselectedOption.getAttribute("device-type");
        sourceDeviceName = sourceDeviceDiv.text;
        selectedSourceDeviceType = srcselectedDeviceType;
        sourceActionDiv.innerHTML="";
        for(var index in scenarioStatusChoices[srcselectedDeviceType]){
          var option = document.createElement("option");
          option.setAttribute("value",statusDefinition[scenarioStatusChoices[srcselectedDeviceType][index]]);
          option.text = scenarioStatusChoices[srcselectedDeviceType][index];
          sourceActionDiv.add(option);
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

        destinationActionDiv.addEventListener("change", function(e){
          e.preventDefault();
          scenarioPayload.scenarioCommand = destinationActionDiv.value;
        });

        destinationBridge.addEventListener("change", function(e){
          e.preventDefault();
          scenarioPayload.scenarioDestinationKey = destinationBridge.value;
        });


        sourceDeviceDiv.addEventListener("change",function(e){
          e.preventDefault();
          var selectedOption = sourceDeviceDiv.options[sourceDeviceDiv.selectedIndex];
          var selectedDeviceType = selectedOption.getAttribute("device-type");
          selectedSourceDeviceType = selectedDeviceType;
          sourceDeviceName = sourceDeviceDiv.text;
          sourceActionDiv.innerHTML="";

          if(touchkeys.includes(selectedDeviceType)){
            sourceBridge.style.display="block";
            sourceBridge.innerHTML = "";
            for(var index in scenarioBridgeChoices[selectedDeviceType]){
              var option = document.createElement("option");
              option.setAttribute("value",bridgeDefinition[scenarioBridgeChoices[selectedDeviceType][index]]);
              option.text = scenarioBridgeChoices[selectedDeviceType][index];
              sourceBridge.add(option);
            }
          }else{
            sourceBridge.style.display="none";
          }

          for(var index in scenarioStatusChoices[selectedDeviceType]){
            var option = document.createElement("option");
            option.setAttribute("value",statusDefinition[scenarioStatusChoices[selectedDeviceType][index]]);
            option.text = scenarioStatusChoices[selectedDeviceType][index];
            sourceActionDiv.add(option);
          }
        });

        sourceActionDiv.addEventListener("change",function(e){
          e.preventDefault();
          scenarioPayload.scenarioSourceValue = sourceActionDiv.value;
        });

        sourceBridge.addEventListener("change", function(e){
          e.preventDefault();
          scenarioPayload.scenarioSourceKey = sourceBridge.value;
        });

        
        submitScenario.addEventListener("click", function(e){
          e.preventDefault();
          if(!touchkeys.includes(selectedSourceDeviceType)){
            scenarioPayload.scenarioSourceKey = "status1";
          }

          if(!touchkeys.includes(selectedDestinationDeviceType)){
            scenarioPayload.scenarioDestinationKey = "command1";
          }

          scenarioPayload.scenarioCommand = destinationActionDiv.value;
          scenarioPayload.scenarioDestinationKey = destinationBridge.value;

          scenarioPayload.scenarioSourceValue = sourceActionDiv.value;
          scenarioPayload.scenarioSourceKey = sourceBridge.value;

          console.log(scenarioPayload);
        });
    }));
}).finally(()=>{
  spinner.classList.remove("show");
});