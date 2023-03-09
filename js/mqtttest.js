var mqtt;
var reconnectTimeout = 2000;
var host = "45.139.102.188"
var port = 9001;

function subscribe(topic){
    mqtt.subscribe(topic);
}

function getVersionOrStatus(client,topic,request){
    console.log("Get Version or Status");    
    switch(request){
        case "status":
            commands.command1="s";
            break;
        case "version":
            commands.device="v";
            break;
    }
    var message = new Paho.MQTT.Message(JSON.stringify(commands));
    message.destinationName = topic;
    client.send(message);
}

function sendCommand(client,commandName,commandValue,topic){
    commands.commandName = commandValue;
    var message = new Paho.MQTT.Message(JSON.stringify(commands));
    message.destinationName = topic;
    client.send(message);
}



function onConnect(){
    console.log('connect');
    mqtt.subscribe("b47122e3-023a-4324-97e1-0bcef239de68/q3zpu/xwsy6/xtErL/status");
    commands.command1 = 1;
    var message = new Paho.MQTT.Message(JSON.stringify(commands));
    message.destinationName = "b47122e3-023a-4324-97e1-0bcef239de68/q3zpu/xwsy6/xtErL"
    mqtt.send(message);
}

function onFailure(){
    console.log("FAILED");
}

function onMessageArrived(msg){
    var message = JSON.parse(msg.payloadString)
    console.log(message);
}

async function mqttConnect(){
    mqtt = new Paho.MQTT.Client(host,port,"BMS Dash");
    var option = {
        userName:"admin",
        password:"admin123",
        timeout:3,
        onSuccess: onConnect,
        onFailure:onFailure,
    }
    mqtt.onMessageArrived = onMessageArrived;
    mqtt.connect(option);

}

var commands = {
    "command1":"x",
    "command2":"x",
    "command3":"x",
    "command4":"x",
    "device":"x",
    "did":0,
    "min":0,
    "max":0
}


// var message = new Paho.MQTT.Message(JSON.stringify(commands));
// // message`.destinationName` = "	b47122e3-023a-4324-97e1-0bcef239de68/q3zpu/xwsy6/xtErL"

// message.destinationName = "test/jstest";

mqttConnect();