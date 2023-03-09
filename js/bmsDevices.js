var topic = document.getElementById('downTopic').value;
var ackTopic = document.getElementById('ackTopic').value;

var connectionState = false;

var mqtt;
var reconnectTimeout = 2000;
var host = "185.2.14.188"
var port = 9001;

let unicodeDegCel = '℃';

var devEui = document.getElementById('devEui').value;

var relay1Ok = parseInt(document.getElementById('relay1Ok').value);
var relay2Ok = parseInt(document.getElementById('relay2Ok').value);
var relay3Ok = parseInt(document.getElementById('relay3Ok').value);
var relay4Ok = parseInt(document.getElementById('relay4Ok').value);

var servoOk = parseInt(document.getElementById('servoOk').value);
var dhtOk = parseInt(document.getElementById('dhtOk').value);

mqttConnect();


console.log(topic);

var togglesButton = {
    "RELAY1":"relay1Switch",
    "RELAY2":"relay2Switch",
    "RELAY3":"relay3Switch",
    "RELAY4":"relay4Switch",
    "SERVO": "relayServo"
}

if(dhtOk){
    var thermostatTemp = new CircleProgress('#temperatureCirProg',{
        max:100,
        value:0,
        textFormat:function(value){
            return unicodeDegCel + " " + value;
        }
    });

    var thermostatHum = new CircleProgress('#humidityCirProg',{
        max:100,
        value:0,
        textFormat:'percent'
    });
}

function hexToBase64(hexstring) {
    return btoa(hexstring.match(/\w{2}/g).map(function(a) {
        return String.fromCharCode(parseInt(a, 16));
    }).join(""));
}


function relay1Action(){
    console.log("Relay 1 Active");
    
    var commands ={
        "confirmed":true,
        "fPort":"x",
        "data":"x",
        "devEui":"x"
    };

    var relay1OnOff = document.getElementById('relay1Switch');
    var relay1Fport = document.getElementById('relay1Fport').value;
    var relay1Channel = document.getElementById('relay1Channel').value;

    var onCommand = "0" + relay1Channel + "01";
    var offCommand = "0" + relay1Channel + "00";

    commands.confirmed = true;
    commands.devEui = devEui;
    commands.fPort = parseInt(relay1Fport);

    relay1OnOff.addEventListener("change",function(e){
        e.preventDefault();
        if(relay1OnOff.checked){
            commands.data=hexToBase64(onCommand);
        }else{
            commands.data=hexToBase64(offCommand);
        }
        console.log(commands);
        var message = new Paho.MQTT.Message(JSON.stringify(commands));
        message.destinationName = topic;
        mqtt.send(message);
    });
}


function relay2Action(){
    console.log("Relay 2 Active");
    
    var commands ={
        "confirmed":true,
        "fPort":"x",
        "data":"x",
        "devEui":"x"
    };

    var relay2OnOff = document.getElementById('relay2Switch');
    var relay2Fport = document.getElementById('relay2Fport').value;
    var relay2Channel = document.getElementById('relay2Channel').value;

    var onCommand = "0" + relay2Channel + "01";
    var offCommand = "0" + relay2Channel + "00";

    commands.confirmed = true;
    commands.devEui = devEui;
    commands.fPort = parseInt(relay2Fport);

    relay2OnOff.addEventListener("change",function(e){
        e.preventDefault();
        if(relay2OnOff.checked){
            commands.data=hexToBase64(onCommand);
        }else{
            commands.data=hexToBase64(offCommand);
        }
        var message = new Paho.MQTT.Message(JSON.stringify(commands));
        message.destinationName = topic;
        mqtt.send(message);
    });
}

function relay3Action(){
    console.log("Relay 3 Active");
    
    var commands ={
        "confirmed":true,
        "fPort":"x",
        "data":"x",
        "devEui":"x"
    };

    var relay3OnOff = document.getElementById('relay3Switch');
    var relay3Fport = document.getElementById('relay3Fport').value;
    var relay3Channel = document.getElementById('relay3Channel').value;

    var onCommand = "0" + relay3Channel + "01";
    var offCommand = "0" + relay3Channel + "00";

    commands.confirmed = true;
    commands.devEui = devEui;
    commands.fPort = parseInt(relay3Fport);

    relay3OnOff.addEventListener("change",function(e){
        e.preventDefault();
        if(relay3OnOff.checked){
            commands.data=hexToBase64(onCommand);
        }else{
            commands.data=hexToBase64(offCommand);
        }
        var message = new Paho.MQTT.Message(JSON.stringify(commands));
        message.destinationName = topic;
        mqtt.send(message);
    });
}


function relay4Action(){
    console.log("Relay 4 Active");
    
    var commands ={
        "confirmed":true,
        "fPort":"x",
        "data":"x",
        "devEui":"x"
    };

    var relay4OnOff = document.getElementById('relay4Switch');
    var relay4Fport = document.getElementById('relay4Fport').value;
    var relay4Channel = document.getElementById('relay4Channel').value;

    var onCommand = "0" + relay4Channel + "01";
    var offCommand = "0" + relay4Channel + "00";

    commands.confirmed = true;
    commands.devEui = devEui;
    commands.fPort = parseInt(relay4Fport);

    relay4OnOff.addEventListener("change",function(e){
        e.preventDefault();
        if(relay4OnOff.checked){
            commands.data=hexToBase64(onCommand);
        }else{
            commands.data=hexToBase64(offCommand);
        }
        var message = new Paho.MQTT.Message(JSON.stringify(commands));
        message.destinationName = topic;
        mqtt.send(message);
    });
}


function servoAction(){
    console.log("Servo Active");
    
    var commands ={
        "confirmed":true,
        "fPort":"x",
        "data":"x",
        "devEui":"x"
    };

    var servoOnOff = document.getElementById('servoonoff');
    var servoFport = document.getElementById('servoFport').value;
    var servoChannel = document.getElementById('servoChannel').value;

    var onCommand = "0" + servoChannel + "01";
    var offCommand = "0" + servoChannel + "00";

    commands.confirmed = true;
    commands.devEui = devEui;
    commands.fPort = parseInt(servoFport);

    servoOnOff.addEventListener("change",function(e){

        e.preventDefault();

        if(servoOnOff.checked){
            commands.data=hexToBase64(onCommand);
        }
        
        else{
            commands.data=hexToBase64(offCommand);
        }

        var message = new Paho.MQTT.Message(JSON.stringify(commands));
        message.destinationName = topic;
        mqtt.send(message);
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
    mqtt.subscribe(ackTopic);
}

function onFailure(){
    console.log("FAILED");
}

function onSuccess(){
    if(relay1Ok==1){
        relay1Action();
    }

    if(relay2Ok==1){
        relay2Action();
    }

    if(relay3Ok==1){
        relay3Action();
    }

    if(relay4Ok==1){
        relay4Action();
    }

    if(servoOk==1){
        servoAction();
    }
}

function mqttConnect(){
    mqtt = new Paho.MQTT.Client(host,port,"BMS Dash");
    var option = {
        userName:"admin",
        password:"admin123",
        timeout:3,
        onSuccess: onConnect,
        onFailure: onFailure,
        onSuccess: onSuccess
    }
    mqtt.onMessageArrived = onMessageArrived;
    mqtt.connect(option);
}