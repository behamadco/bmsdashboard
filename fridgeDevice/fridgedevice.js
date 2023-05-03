import { getFridge, getTemperatureToday, getAllNotification } from "../js/Functions.js";

var uuid = sessionStorage.getItem("uuid");
var token = sessionStorage.getItem("token");
var username = sessionStorage.getItem("username");
var brokerUsername = sessionStorage.getItem("brokeruser");
var brokerPassword = sessionStorage.getItem("brokerpass");
var topic;
var statusTopic;
var connectionStatus = false;
var deviceType;
var mqtt = new Paho.MQTT.Client("185.2.14.188",9001,"BMS Dash");
var thermostatTemp;
var fridgeID;
var fridgeImei;



var deviceCommands = {
    "fid":"x",
    "IMEI":"x",
    "agent":"x",
    "interval":"x",
    "device":"x",
    "data":"x"
};
var spinner = document.getElementById("spinner");
var fridgeDiv = document.getElementById("fridge");
var fridgeId = localStorage.getItem("fridgeDevicePage");
var devicePulicNameDiv = document.getElementById("devicePublicName");
var fridgeNameDiv = document.getElementById("fridgeName");
var simphonenumberDiv = document.getElementById("simphonenumber");
var imeiDiv = document.getElementById("imei");
var deviceIconImage = document.getElementById("deviceIcon");
var connectStatus = document.getElementById("connectStatus");
var temperatureValue
var notificationDiv = document.getElementById("notificationDiv");
var version = document.getElementById("version");
var chart = document.getElementById("fridgeChart");


function padWithLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, '0');
  }
  

async function sendVersionRequest(){
    deviceCommands.device="v";
    var message = new Paho.MQTT.Message(JSON.stringify(deviceCommands));
    console.log(topic);
    message.destinationName = topic;
    mqtt.send(message);
}


function sendStatus(){
    console.log("sendStatus","Executed");
    console.log("FID",fridgeID,"fridgeImei",fridgeImei)
    deviceCommands.fid = fridgeID;
    deviceCommands.IMEI = fridgeImei;
    deviceCommands.agent = "web"; 
    deviceCommands.device = "x";
    var message = new Paho.MQTT.Message(JSON.stringify(deviceCommands));
    console.log(topic);
    message.destinationName = topic;
    mqtt.send(message);
}


function periodicalRequest(){
    setInterval(()=>{
        console.log("periodicalRequest","Executed!");
        sendStatus();
    },5000)
}

function onMessageArrived(msg){
    var deviceStatus = JSON.parse(msg.payloadString);
    console.log(deviceStatus);

    if(deviceStatus.version!=null){
        connectStatus.innerHTML = "متصل";
        version.innerHTML = deviceStatus.version;
        connectionStatus = true;
        connectStatus.classList.remove("not-connected");
        connectStatus.classList.add("connectivity");
    }

    if(deviceStatus.temperature!=null){
        if(deviceStatus.agent=="web"){
            temperatureValue.innerHTML = deviceStatus.temperature;
        }
    }
}

function onConnect(){
    console.log('CONNECTED');
    mqtt.subscribe(statusTopic);
    console.log("Subscribed");
    sendVersionRequest().then(()=>{
        setTimeout(()=>{
            if(!connectionStatus){
                connectStatus.innerHTML = "دستگاه متصل نیست و یا خاموش است";
                version.innerHTML = "خطا در دریافت نسخه دستگاه";
            }
          },5000);
          sendStatus();
          periodicalRequest();
    });
}

function onFailure(){
    console.log("FAILED");
}

function mqttConnect(client){
    var option = {
        userName:brokerUsername,
        password:brokerPassword,
        timeout:3,
        onSuccess: onConnect,
        onFailure:onFailure,
    }
    client.onMessageArrived = onMessageArrived;
    client.connect(option);
}


getAllNotification(uuid,token).then(res =>{
    fetch("/publicComponents/notificationRow.html").then(componentResponse=>componentResponse.text().then(notificationHtml=>{
        for(var index in res["data"]){
            notificationDiv.innerHTML += notificationHtml.replace("#notificationText",res["data"][index]["subject"]);
        }
    })).finally(()=>{notificationDiv.innerHTML += "<a href='#' class='dropdown-item text-center'>دیدن همه اطلاعیه ها</a>"});
});

getFridge(fridgeId,uuid,token).then(getFridgeResponse=>{
    var fridgeData = getFridgeResponse["data"];
    fridgeNameDiv.innerHTML = fridgeData["name"];
    simphonenumberDiv.innerHTML = fridgeData["simPhoneNumber"];
    imeiDiv.innerHTML = fridgeData["imei"];
    fridgeImei = fridgeData["imei"];
    fridgeID = fridgeData["id"];
    getTemperatureToday(fridgeId,uuid,token).then(getTemperatureTodayResponse=>{
        var temperatureData = getTemperatureTodayResponse["data"];
        var chartData = [];
        console.log(temperatureData);
        for(var index in temperatureData){
            var tempDate = new Date(temperatureData[index]["timestamp"])
            var timeOfTemp = padWithLeadingZeros(tempDate.getHours(),2)+":"+padWithLeadingZeros(tempDate.getMinutes(),2)+":"+padWithLeadingZeros(tempDate.getSeconds(),2);
            var context = {"x":timeOfTemp,"y":temperatureData[index]["value"]};
            chartData.push(context);
        }
        fetch("components/thermostat.html").then(componentResponse=>{
            componentResponse.text().then(fridgeHtml=>{
                topic = fridgeData["macAddress"];
                statusTopic = fridgeData["macAddress"] + "/status";
                mqttConnect(mqtt);
                fridgeDiv.insertAdjacentHTML("beforeend",fridgeHtml.replace("#temperatureValue","0"));
                temperatureValue = document.getElementById("temperatureValue");
                
                new Chart(chart,{
                    'type':'line',
                    'data': {
                        "datasets":[
                            {
                                "label":"دما",
                                "data":chartData,
                                "fill":false,
                                'borderColor': 'rgb(75, 192, 192)',
                                'tension': 0.1
                            }
                        ]
                    },
                    'options': {   
                        'plugins': {
                            'title': {
                                'display': true,
                                'text': 'نمودار دما در 24 ساعت'
                            }
                        }
                    }
                });
            });
        });
    });
}).finally(()=>{
    spinner.classList.remove("show");
});