import { getBuilding, getDeviceByID, getPlace, getFridge, getTemperatureToday, getAllNotification } from "../js/Functions.js";

var uuid = sessionStorage.getItem("uuid");
var token = sessionStorage.getItem("token");
var username = sessionStorage.getItem("username");
var brokerUsername = sessionStorage.getItem("brokeruser");
var brokerPassword = sessionStorage.getItem("brokerpass");
var topic;
var statusTopic;
var connectionStatus = false;
var deviceType;
let unicodeDegCel = '℃';
var mqtt = new Paho.MQTT.Client("185.2.14.188",9001,"BMS Dash");

var deviceCommands = {
    "command1":"x",
    "command2":"x",
    "command3":"x",
    "command4":"x",
    "device":"x",
    "data":"x",
    "did":0,
    "min":0,
    "max":0
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
var notificationDiv = document.getElementById("notificationDiv");

var version = document.getElementById("version");
var potCirProg;
var thermostatTemp;
var thermostatHum;
var chart = document.getElementById("fridgeChart");

async function sendStatusandVersionRequest(){
    deviceCommands.device="v";
    var message = new Paho.MQTT.Message(JSON.stringify(deviceCommands));
    console.log(topic);
    message.destinationName = topic;
    mqtt.send(message);
}


async function sendStatus(){
    deviceCommands.command1="s";
    var message = new Paho.MQTT.Message(JSON.stringify(deviceCommands));
    console.log(topic);
    message.destinationName = topic;
    mqtt.send(message);
}

function onMessageArrived(msg){
    var deviceStatus = JSON.parse(msg.payloadString);
    console.log(deviceStatus);
    
}

function onConnect(){
    console.log('CONNECTED');
    mqtt.subscribe(statusTopic);
    console.log("Subscribed");
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
    getTemperatureToday(fridgeId,uuid,token).then(getTemperatureTodayResponse=>{
        var temperatureData = getTemperatureTodayResponse["data"];
        var chartData = [];
        for(var index in temperatureData){
            var tempDate = new Date(temperatureData[index]["timestamp"])
            var timeOfTemp = tempDate.getHours()+":"+tempDate.getMinutes()+":"+tempDate.getSeconds();
            var context = {"x":timeOfTemp,"y":temperatureData[index]["value"]};
            chartData.push(context);
        }
        fetch("components/thermostat.html").then(componentResponse=>{
            componentResponse.text().then(fridgeHtml=>{
                fridgeDiv.insertAdjacentHTML("beforeend",fridgeHtml);
                thermostatTemp = new CircleProgress('#temperatureCirProg',{
                    max:100,
                    value:0,
                    textFormat:function(value){
                        return unicodeDegCel + " " + value;
                    }
                });
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