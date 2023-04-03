import { getAllNotification, getBmsDevice, getBmsSubDevices } from "../js/Functions.js";

var relay1Ok = false;
var relay2Ok = false;
var relay3Ok = false;
var relay4Ok = false;

var relay1Fport = null;
var relay2Fport = null;
var relay3Fport = null;
var relay4Fport = null;
var dhtFport = null;
var servoFport = null;

var relay1Channel = null;
var relay2Channel = null;
var relay3Channel = null;
var relay4Channel = null;
var dhtChannel = null;
var servoChannel = null;

var relay1Div = document.getElementById("relay1Div");
var relay2Div = document.getElementById("relay2Div");
var relay3Div = document.getElementById("relay3Div");
var relay4Div = document.getElementById("relay4Div");

var dhtTempDiv = document.getElementById("dhttemp");
var dhtHumDiv = document.getElementById("dhthum");
var servoDiv = document.getElementById("servoDiv");

var relay1Switch = document.getElementById("relay1Switch");

var notificationDiv = document.getElementById("notificationDiv");
var loraDeviceName = document.getElementById("loraDeviceName");

var mqtt = new Paho.MQTT.Client("185.2.14.188",9001,"BMS Dash");
var topic;
var statusTopic;
let unicodeDegCel = '℃';

var uuid = sessionStorage.getItem("uuid");
var token = sessionStorage.getItem("token");
var brokerUsername = sessionStorage.getItem("brokeruser");
var brokerPassword = sessionStorage.getItem("brokerpass");

var devEui = localStorage.getItem("bmsDevicePageDevEUI");

var spinner = document.getElementById("spinner");

var thermostatTemp;
var thermostatHum;

var commands ={
    "confirmed":true,
    "fPort":"x",
    "data":"x",
    "devEui":"x"
};

function hexToBase64(hexstring) {
    return btoa(hexstring.match(/\w{2}/g).map(function(a) {
        return String.fromCharCode(parseInt(a, 16));
    }).join(""));
}


function sendCommand(command,fPort,channel){
    var commandToSend = "0" + channel + command;
    commands.confirmed = true;
    commands.devEui = devEui;
    commands.fPort = parseInt(fPort);
    commands.data = hexToBase64(commandToSend);

    var message = new Paho.MQTT.Message(JSON.stringify(commands));
    message.destinationName = topic;
    console.log(topic,commands);
    mqtt.send(message)
}

function relay1Action() { 
    console.log("RELAY1ACTION");
    var relay1Switch = document.getElementById("relay1Switch");
    relay1Switch.addEventListener("change",function(e){
        e.preventDefault();
        if(relay1Switch.checked){sendCommand("01",relay1Fport,relay1Channel)}
        else{sendCommand("00",relay1Fport,relay1Channel)}
    });
}

function relay2Action() {
    var relay2Switch = document.getElementById("relay2Switch");
    relay2Switch.addEventListener("change",function(e){
        e.preventDefault();
        if(relay2Switch.checked){sendCommand("01",relay2Fport,relay2Channel)}
        else{sendCommand("00",relay2Fport,relay2Channel)}
    });
}

function relay3Action() {
    var relay3Switch = document.getElementById("relay3Switch");
    relay3Switch.addEventListener("change",function(e){
        e.preventDefault();
        if(relay3Switch.checked){sendCommand("01",relay3Fport,relay3Channel)}
        else{sendCommand("00",relay3Fport,relay3Channel)}
    });
}

function relay4Action() {
    var relay4Switch = document.getElementById("relay4Switch");
    relay4Switch.addEventListener("change",function(e){
        e.preventDefault();
        if(relay4Switch.checked){sendCommand("01",relay4Fport,relay4Channel)}
        else{sendCommand("00",relay4Fport,relay4Channel)}
    });
}

function servoAction() {
    var servoSwitch = document.getElementById("servoSwitch");
    servoSwitch.addEventListener("change",function name(e) {
        e.preventDefault();
        if(servoSwitch.checked){sendCommand("01",servoFport,servoChannel)}
        else{sendCommand("01",servoFport,servoChannel)}
    });
}

function onMessageArrived(msg){
    var message = JSON.parse(msg.payloadString);
    var response = message["object"]["Info"];
    var statusCode = response["StatusCode"];
    var channel = response["Channel"];
    var command = response["Command"];
    console.log(statusCode,channel,command);

}

function onConnect(){
    console.log('CONNECTED');
    console.log(topic);
    console.log(statusTopic);
    console.log(relay1Channel,relay2Channel,relay3Channel,relay4Channel);
    mqtt.subscribe(statusTopic);
    console.log("Subscribed");
}


function onFailure(){
    console.log("FAILED");
}

function mqttConnect(client){
    var option = {
        userName: brokerUsername,
        password: brokerPassword,
        timeout:  3,
        onSuccess:onConnect,
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



getBmsDevice(devEui,uuid,token).then(getBmsDeviceResponse=>{
    loraDeviceName.innerHTML = getBmsDeviceResponse["data"]["devname"];
    topic = "application/"+getBmsDeviceResponse["data"]["appId"]+"/device/"+getBmsDeviceResponse["data"]["devEui"]+"/command/down";
    statusTopic = "application/"+getBmsDeviceResponse["data"]["appId"]+"/device/"+getBmsDeviceResponse["data"]["devEui"]+"/event/up";
    getBmsSubDevices(devEui,uuid,token).then(getBmsSubDevicesResponse=>{
        for(var index in getBmsSubDevicesResponse["data"]){
            if(getBmsSubDevicesResponse["data"][index]["subDeviceName"]=="RELAY1"){
                relay1Div.style.display = "inline-block";
                relay1Fport = getBmsSubDevicesResponse["data"][index]["subDeviceFport"];
                relay1Channel = getBmsSubDevicesResponse["data"][index]["subDeviceChannel"];
            }
            if(getBmsSubDevicesResponse["data"][index]["subDeviceName"]=="RELAY2"){
                relay2Div.style.display = "inline-block";
                relay2Fport = getBmsSubDevicesResponse["data"][index]["subDeviceFport"];
                relay2Channel = getBmsSubDevicesResponse["data"][index]["subDeviceChannel"];
            }

            if(getBmsSubDevicesResponse["data"][index]["subDeviceName"]=="RELAY3"){
                relay3Div.style.display = "inline-block";
                relay3Fport = getBmsSubDevicesResponse["data"][index]["subDeviceFport"];
                relay3Channel = getBmsSubDevicesResponse["data"][index]["subDeviceChannel"];
            }
            
            if(getBmsSubDevicesResponse["data"][index]["subDeviceName"]=="RELAY4"){
                relay4Div.style.display = "inline-block";
                relay4Fport = getBmsSubDevicesResponse["data"][index]["subDeviceFport"];
                relay4Channel = getBmsSubDevicesResponse["data"][index]["subDeviceChannel"];
            }
            
            if(getBmsSubDevicesResponse["data"][index]["subDeviceName"]=="DHT22"){
                dhtTempDiv.style.display = "inline-block";
                dhtHumDiv.style.display = "inline-block";
                dhtFport = getBmsSubDevicesResponse["data"][index]["subDeviceFport"];
                dhtChannel = getBmsSubDevicesResponse["data"][index]["subDeviceChannel"];
            }

            if(getBmsSubDevicesResponse["data"][index]["subDeviceName"]=="SERVO"){
                servoDiv.style.display = "inline-block";
                servoFport = getBmsSubDevicesResponse["data"][index]["subDeviceFport"];
                servoChannel = getBmsSubDevicesResponse["data"][index]["subDeviceChannel"];
            }
        }
    }).finally(function(){
        fetch("components/relay1.html").then(relay1ComponentResponse=>relay1ComponentResponse.text().then(subDeviceHtml=>{
            relay1Div.insertAdjacentHTML("beforeend",subDeviceHtml);
            relay1Action();
        }));
        fetch("components/relay2.html").then(relay2ComponentResponse=>relay2ComponentResponse.text().then(subDeviceHtml=>{
            relay2Div.insertAdjacentHTML("beforeend",subDeviceHtml);
            relay2Action();
        }));
        fetch("components/relay3.html").then(relay3ComponentResponse=>relay3ComponentResponse.text().then(subDeviceHtml=>{
            relay3Div.insertAdjacentHTML("beforeend",subDeviceHtml);
            relay3Action();
        }));
        fetch("components/relay4.html").then(relay4ComponentResponse=>relay4ComponentResponse.text().then(subDeviceHtml=>{
            relay4Div.insertAdjacentHTML("beforeend",subDeviceHtml);
            relay4Action();
        }));
        fetch("components/servo.html").then(servoComponentResponse=>servoComponentResponse.text().then(subDeviceHtml=>{
            servoDiv.insertAdjacentHTML("beforeend",subDeviceHtml);
            servoAction();
        }));
        fetch("components/dhttemp.html").then(dhtComponentResponse=>dhtComponentResponse.text().then(subDeviceHtml=>{
            dhtTempDiv.insertAdjacentHTML("beforeend",subDeviceHtml);
            thermostatTemp = new CircleProgress('#temperatureCirProg',{
                max:100,
                value:0,
                textFormat:function(value){
                    return unicodeDegCel + " " + value;
                }
            });
        }));
        fetch("components/dhthum.html").then(dhtComponentResponse=>dhtComponentResponse.text().then(subDeviceHtml=>{
            dhtHumDiv.insertAdjacentHTML("beforeend",subDeviceHtml);
            thermostatHum = new CircleProgress('#humidityCirProg',{
                max:100,
                value:0,
                textFormat:'percent'
            });
        }));
        mqttConnect(mqtt);
    });
}).finally(function(){
    spinner.classList.remove("show");
});
