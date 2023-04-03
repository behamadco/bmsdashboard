import { getBuilding, getDeviceByID, getPlace } from "../js/Functions.js";

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


var deviceComponents = {
    "BUZZER":"components/buzzer.html",
    "COOLER_KEY":"components/coolerKey.html",
    "CURTAIN":"components/curtain.html",
    "DIMMER":"components/dimmer.html",
    "FLOWERPOT":"components/flowerPot.html",
    "SENSOR":"components/gasSensor.html",
    "HEIGHTDETECTOR":"components/heightdetector.html",
    "LOCK":"components/lock.html",
    "MOTIONDETECTOR":"components/motionDetector.html",
    "SOCKET":"components/socket.html",
    "THERMOSTAT":"components/thermostat.html",
    "TOUCHKEY":"components/touchkey.html",
    "TOUCHKEY_2B":"components/touchkey2.html",
    "TOUCHKEY_3B":"components/touchkey3.html",
    "TOUCHKEY_4B":"components/touchkey4.html",
    "TOUCHKEY_16B":"components/touchkey16.html",
    "VALVE":"components/valve.html",
    "WINDOWDOORSENSOR":"components/windowdoorsensor.html"
};

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
};


var devicePublicName = {
    "BUZZER":"آزیر هوشمند",
    "COOLER_KEY":"کلید کولر",
    "FLOWERPOT": "رطوبت خاک",
    "SENSOR":"سنسور دود و گاز",
    "IR":"مادون قرمز",
    "LOCK":"قفل درب",
    "MOTIONDETECTOR":"سنسور تشخیص حرکت",
    "POWER":"انرژی سنج",
    "SOCKET":"پریز هوشمند",
    "THERMOSTAT": "ترموستات هوشمند",
    "TOUCHKEY":"کلید تک پل",
    "TOUCHKEY_2B": "کلید دو پل",
    "TOUCHKEY_3B": "کلید سه پل",
    "TOUCHKEY_4B": "کلید چهار پل",
    "TOUCHKEY_16B": "کلید شانزده پل",
    "VALVE": "شیر برقی",
    "HEIGHTDETECTOR": "سنسور سنجش ارتفاع",
    "WINDOW_DOORSENSOR": "سنسور درب و پنجره",
    "CURTAIN": "پرده برقی هوشمند",
    "DIMMER":"دیمر هوشمند",
};

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
var deviceDiv = document.getElementById("device");
var deviceId = localStorage.getItem("devicePageDeviceId");
var devicePulicNameDiv = document.getElementById("devicePublicName");
var deviceNameDiv = document.getElementById("deviceName");
var deviceIconImage = document.getElementById("deviceIcon");
var connectStatus = document.getElementById("connectStatus");
var version = document.getElementById("version");
var potCirProg;
var thermostatTemp;
var thermostatHum;

function socketActions(){
    console.log("SOCKET");
    var socket = document.getElementById('socket');
    socket.addEventListener("click",(e)=>{
        e.preventDefault();
        if(socket.getAttribute('val')=="1"){
            deviceCommands.command1 = 0;
            socket.classList.remove('power-on');
            socket.classList.add('power-off');
            socket.setAttribute('val','0');
        }else if(socket.getAttribute('val')=="0"){
            deviceCommands.command1 = 1;
            socket.classList.remove('power-off');
            socket.classList.add('power-on');
            socket.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(deviceCommands));
        message.destinationName = topic;
        mqtt.send(message);
    });
}

function coolerKeyActions(){
    var pompPower = document.getElementById('pomp');
    var slowPower = document.getElementById('slow');
    var fastPower = document.getElementById('fast');
    pompPower.addEventListener("click",(e)=>{
        e.preventDefault();
        if(pompPower.getAttribute('val')=="1"){
            deviceCommands.command1 = 0;
            pompPower.classList.remove('power-on');
            pompPower.classList.add('power-off');
            pompPower.setAttribute('val','0');
        }else if(pompPower.getAttribute('val')=="0"){
            deviceCommands.command1 = 1;
            pompPower.classList.remove('power-off');
            pompPower.classList.add('power-on');
            pompPower.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(deviceCommands));
        message.destinationName = topic;
        mqtt.send(message);
    });
    slowPower.addEventListener("click",(e)=>{
        e.preventDefault();
        if(slowPower.getAttribute('val')=="1"){
            deviceCommands.command2 = 0;
            slowPower.classList.remove('power-on');
            slowPower.classList.add('power-off');
            slowPower.setAttribute('val','0');
        }else if(slowPower.getAttribute('val')=="0"){
            deviceCommands.command2 = 1;
            slowPower.classList.remove('power-off');
            slowPower.classList.add('power-on');
            slowPower.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(deviceCommands));
        message.destinationName = topic;
        mqtt.send(message);
    });
    fastPower.addEventListener("click",(e)=>{
        e.preventDefault();
        if(fastPower.getAttribute('val')=="1"){
            deviceCommands.command3 = 0;
            fastPower.classList.remove('power-on');
            fastPower.classList.add('power-off');
            fastPower.setAttribute('val','0');
        }else if(fastPower.getAttribute('val')=="0"){
            deviceCommands.command3 = 1;
            fastPower.classList.remove('power-off');
            fastPower.classList.add('power-on');
            fastPower.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(deviceCommands));
        message.destinationName = topic;
        mqtt.send(message);
    });
}

function lockActions(){
    var lock = document.getElementById('openLock');
    lock.addEventListener('click',function(e){
        e.preventDefault();
        deviceCommands.command1 = 1;
        var message = new Paho.MQTT.Message(JSON.stringify(deviceCommands));
        message.destinationName = topic;
        mqtt.send(message);
    });
}

function curtainActions(){
    var curtainRange = document.getElementById('curtainRange');
    var curtainPercent = document.getElementById('curtainValue');
    curtainRange.addEventListener('change',function(e){
        e.preventDefault();
        deviceCommands.data = curtainRange.value;
        curtainPercent.innerHTML = curtainRange.value + "%";
        var message = new Paho.MQTT.Message(JSON.stringify(deviceCommands));
        message.destinationName = topic;
        mqtt.send(message);
    });
}

function buzzerAction(){
    var buzzerOnOff = document.getElementById('buzzerOnOff');
    buzzerOnOff.addEventListener("change",(e)=>{
        e.preventDefault();
        if(buzzerOnOff.checked){
            devicecommands.command1 = 1;
        }else{
            deviceCommands.command1 = 0;
        }
        var message = new Paho.MQTT.Message(JSON.stringify(deviceCommands));
        message.destinationName = topic;
        mqtt.send(message);
    });
}

function touchkeyOneBridgeActions(){
    var bridgeOnePower = document.getElementById('bridge1');
    bridgeOnePower.addEventListener("click",(e)=>{
        e.preventDefault();
        if(bridgeOnePower.getAttribute('val')=="1"){
            deviceCommands.command1 = 0;
            bridgeOnePower.classList.remove('power-on');
            bridgeOnePower.classList.add('power-off');
            bridgeOnePower.setAttribute('val','0');
        }else if(bridgeOnePower.getAttribute('val')=="0"){
            deviceCommands.command1 = 1;
            bridgeOnePower.classList.remove('power-off');
            bridgeOnePower.classList.add('power-on');
            bridgeOnePower.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(deviceCommands));
        message.destinationName = topic;
        mqtt.send(message);
    });
}

function touchkeyTwoBridgeActions(){
    var bridgeOnePower = document.getElementById('bridge1');
    var bridgeTwoPower = document.getElementById('bridge2');
    bridgeOnePower.addEventListener("click",(e)=>{
        e.preventDefault();
        if(bridgeOnePower.getAttribute('val')=="1"){
            deviceCommands.command1 = 0;
            bridgeOnePower.classList.remove('power-on');
            bridgeOnePower.classList.add('power-off');
            bridgeOnePower.setAttribute('val','0');
        }else if(bridgeOnePower.getAttribute('val')=="0"){
            deviceCommands.command1 = 1;
            bridgeOnePower.classList.remove('power-off');
            bridgeOnePower.classList.add('power-on');
            bridgeOnePower.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(deviceCommands));
        message.destinationName = topic;
        mqtt.send(message);
    });
    bridgeTwoPower.addEventListener("click",(e)=>{
        e.preventDefault();
        if(bridgeTwoPower.getAttribute('val')=="1"){
            deviceCommands.command2 = 0;
            bridgeTwoPower.classList.remove('power-on');
            bridgeTwoPower.classList.add('power-off');
            bridgeTwoPower.setAttribute('val','0');
        }else if(bridgeTwoPower.getAttribute('val')=="0"){
            deviceCommands.command2 = 1;
            bridgeTwoPower.classList.remove('power-off');
            bridgeTwoPower.classList.add('power-on');
            bridgeTwoPower.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(deviceCommands));
        message.destinationName = topic;
        mqtt.send(message);
    });
}

function touchkeyThreeBridgeActions(){
    var bridgeOnePower = document.getElementById('bridge1');
    var bridgeTwoPower = document.getElementById('bridge2');
    var bridgeThreePower = document.getElementById('bridge3');
    bridgeOnePower.addEventListener("click",(e)=>{
        e.preventDefault();
        if(bridgeOnePower.getAttribute('val')=="1"){
            deviceCommands.command1 = 0;
            bridgeOnePower.classList.remove('power-on');
            bridgeOnePower.classList.add('power-off');
            bridgeOnePower.setAttribute('val','0');
        }else if(bridgeOnePower.getAttribute('val')=="0"){
            deviceCommands.command1 = 1;
            bridgeOnePower.classList.remove('power-off');
            bridgeOnePower.classList.add('power-on');
            bridgeOnePower.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(deviceCommands));
        message.destinationName = topic;
        mqtt.send(message);
    });
    bridgeTwoPower.addEventListener("click",(e)=>{
        e.preventDefault();
        if(bridgeTwoPower.getAttribute('val')=="1"){
            deviceCommands.command2 = 0;
            bridgeTwoPower.classList.remove('power-on');
            bridgeTwoPower.classList.add('power-off');
            bridgeTwoPower.setAttribute('val','0');
        }else if(bridgeTwoPower.getAttribute('val')=="0"){
            deviceCommands.command2 = 1;
            bridgeTwoPower.classList.remove('power-off');
            bridgeTwoPower.classList.add('power-on');
            bridgeTwoPower.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(deviceCommands));
        message.destinationName = topic;
        mqtt.send(message);
    });
    bridgeThreePower.addEventListener("click",(e)=>{
        e.preventDefault();
        if(bridgeOnePower.getAttribute('val')=="1"){
            deviceCommands.command3 = 0;
            bridgeThreePower.classList.remove('power-on');
            bridgeThreePower.classList.add('power-off');
            bridgeThreePower.setAttribute('val','0');
        }else if(bridgeOnePower.getAttribute('val')=="0"){
            deviceCommands.command3 = 1;
            bridgeThreePower.classList.remove('power-off');
            bridgeThreePower.classList.add('power-on');
            bridgeThreePower.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(deviceCommands));
        message.destinationName = topic;
        mqtt.send(message);
    });
}

function touchkeyFourBridgeActions(){
    var bridgeOnePower = document.getElementById('bridge1');
    var bridgeTwoPower = document.getElementById('bridge2');
    var bridgeThreePower = document.getElementById('bridge3');
    var bridgeFourPower = document.getElementById('bridge4');
    bridgeOnePower.addEventListener("click",(e)=>{
        e.preventDefault();
        if(bridgeOnePower.getAttribute('val')=="1"){
            deviceCommands.command1 = 0;
            bridgeOnePower.classList.remove('power-on');
            bridgeOnePower.classList.add('power-off');
            bridgeOnePower.setAttribute('val','0');
        }else if(bridgeOnePower.getAttribute('val')=="0"){
            deviceCommands.command1 = 1;
            bridgeOnePower.classList.remove('power-off');
            bridgeOnePower.classList.add('power-on');
            bridgeOnePower.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(deviceComponents));
        message.destinationName = topic;
        mqtt.send(message);
    });
    bridgeTwoPower.addEventListener("click",(e)=>{
        e.preventDefault();
        if(bridgeTwoPower.getAttribute('val')=="1"){
            deviceCommands.command2 = 0;
            bridgeTwoPower.classList.remove('power-on');
            bridgeTwoPower.classList.add('power-off');
            bridgeTwoPower.setAttribute('val','0');
        }else if(bridgeTwoPower.getAttribute('val')=="0"){
            deviceCommands.command2 = 1;
            bridgeTwoPower.classList.remove('power-off');
            bridgeTwoPower.classList.add('power-on');
            bridgeTwoPower.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(deviceCommands));
        message.destinationName = topic;
        mqtt.send(message);
    });
    bridgeThreePower.addEventListener("click",(e)=>{
        e.preventDefault();
        if(bridgeOnePower.getAttribute('val')=="1"){
            deviceCommands.command3 = 0;
            bridgeThreePower.classList.remove('power-on');
            bridgeThreePower.classList.add('power-off');
            bridgeThreePower.setAttribute('val','0');
        }else if(bridgeOnePower.getAttribute('val')=="0"){
            deviceCommands.command3 = 1;
            bridgeThreePower.classList.remove('power-off');
            bridgeThreePower.classList.add('power-on');
            bridgeThreePower.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(deviceCommands));
        message.destinationName = topic;
        mqtt.send(message);
    });
    bridgeFourPower.addEventListener("click",(e)=>{
        e.preventDefault();
        if(bridgeOnePower.getAttribute('val')=="1"){
            deviceCommands.command4 = 0;
            bridgeThreePower.classList.remove('power-on');
            bridgeThreePower.classList.add('power-off');
            bridgeThreePower.setAttribute('val','0');
        }else if(bridgeOnePower.getAttribute('val')=="0"){
            deviceCommands.command4 = 1;
            bridgeThreePower.classList.remove('power-off');
            bridgeThreePower.classList.add('power-on');
            bridgeThreePower.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(deviceCommands));
        message.destinationName = topic;
        mqtt.send(message);
    });
}


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
    if(deviceStatus.version!=null){
        connectStatus.innerHTML = "متصل";
        version.innerHTML = deviceStatus.version;
        connectionStatus = true;
        connectStatus.classList.remove("not-connected");
        connectStatus.classList.add("connectivity");
    }else{
        switch (deviceType) {
            case "BUZZER":
                var buzzerCheck = document.getElementById('buzzerOnOff');
                if(deviceStatus.status1!=null){
                    if(deviceStatus.status1){
                        buzzerCheck.checked = true;
                    }else{
                        buzzerCheck.checked = false;
                    }
                }
                break;
            case "COOLER_KEY":
                var pomp = document.getElementById('pomp');
                var slow = document.getElementById('slow');
                var fast = document.getElementById('fast');

                if(deviceStatus.status1!=null){
                    if(deviceStatus.status1){
                        pomp.setAttribute("val","1");
                        pomp.classList.remove("power-off");
                        pomp.classList.add("power-on");
                    }else{
                        pomp.setAttribute("val","0");
                        pomp.classList.remove("power-on");
                        pomp.classList.add("power-off")
                    }
                }

                if(deviceStatus.status2!=null){
                    if(message.status2){
                        slow.setAttribute('val',"1");
                        slow.classList.remove("power-off");
                        slow.classList.add("power-on");
                    }else{
                        slow.setAttribute('val','0');
                        slow.classList.remove("power-on");
                        slow.classList.add("power-off");
                    }
                }

                if(deviceStatus.status3!=null){
                    if(message.status3){
                        fast.setAttribute('val',"1");
                        fast.classList.remove("power-off");
                        fast.classList.add("power-on");
                    }else{
                        fast.setAttribute('val','0');
                        fast.classList.remove("power-on");
                        fast.classList.add("power-off");
                    }
                }
                break;
            case "FLOWERPOT":
                potCirProg.value = message.pot
                break;
            case "SENSOR":
                var mq2Status = document.getElementById('mq2Status');
                var progress = document.getElementById('mq2Progress');
                if(deviceStatus.mq2!=null){
                    var gasValue = parseInt(message.mq2);
                    var percentage = (gasValue/2000)*100;
                    progress.style.width = percentage.toString() + "%";
                    if(percentage<=25){
                        mq2Status .innerHTML = "عادی";
                        progress.setAttribute("class","progress-bar bg-success");
                        mq2Status.setAttribute("class","text-success");
                    }else if(percentage>25 & percentage<=50){
                        mq2Status.innerHTML = "کم خطر";
                        progress.setAttribute("class","progress-bar bg-warning");
                        mq2Status.setAttribute("class","text-warning");
                    }else if(percentage>50 & percentage<=75){
                        mq2Status.innerHTML = "پر خطر";
                        progress.setAttribute("class","progress-bar bg-warning");
                        mq2Status.setAttribute("class","text-warning");
                    }else if(percentage>75 & percentage<=100){
                        progress.setAttribute("class","progress-bar bg-danger");
                        mq2Status.setAttribute("class","text-danger");
                        mq2Status.innerHTML="خطرناک";
                    }
                }
                break;
            case "LOCK":
                var lockButton = document.getElementById('openLock');
                if(deviceStatus.status1){
                    lockButton.classList.remove('btn-danger');
                    lockButton.classList.add('btn-warning');
                }else{
                    lockButton.classList.remove('btn-warning');
                    lockButton.classList.add('btn-danger');
                }
                break;
            case "SOCKET":
                var socket = document.getElementById('socket');
                if(deviceStatus.status1){
                    socket.setAttribute('val','1');
                    socket.classList.remove('power-off');
                    socket.classList.add('power-on');
                }else{
                    socket.setAttribute('val','0');
                    socket.classList.remove('power-on');
                    socket.classList.add('power-off');
                }
                break;
            case "THERMOSTAT":
                if(deviceStatus.temperature!=null){
                    var temp = message.temperature;
                    thermostatTemp.value = temp;
                }
                if(deviceStatus.humidity!=null){
                    var hum = message.humidity;
                    thermostatHum.value = hum;
                }
                break;
            case "TOUCHKEY":
                var bridge1 = document.getElementById('bridge1');
                if(deviceStatus.status1){
                    bridge1.setAttribute('val','1');
                    bridge1.classList.remove('power-off');
                    bridge1.classList.add('power-on');
                }else{
                    bridge1.setAttribute('val','0');
                    bridge1.classList.remove('power-on');
                    bridge1.classList.add('power-off');
                }
                break;
            case "TOUCHKEY_2B":
                var bridge1 = document.getElementById('bridge1');
                var bridge2 = document.getElementById('bridge2');
                if(deviceStatus.status1){
                    bridge1.setAttribute('val','1');
                    bridge1.classList.remove('power-off');
                    bridge1.classList.add('power-on');
                }else{
                    bridge1.setAttribute('val','0');
                    bridge1.classList.remove('power-on');
                    bridge1.classList.add('power-off');
                }
                if(deviceStatus.status2){
                    bridge2.setAttribute('val','1');
                    bridge2.classList.remove('power-off');
                    bridge2.classList.add('power-on');
                }else{
                    bridge2.setAttribute('val','0');
                    bridge2.classList.remove('power-on');
                    bridge2.classList.add('power-off');
                }
                break;
            case "TOUCHKEY_3B":
                var bridge1 = document.getElementById('bridge1');
                var bridge2 = document.getElementById('bridge2');
                var bridge3 = document.getElementById('bridge3');
                if(deviceStatus.status1){
                    bridge1.setAttribute('val','1');
                    bridge1.classList.remove('power-off');
                    bridge1.classList.add('power-on');
                }else{
                    bridge1.setAttribute('val','0');
                    bridge1.classList.remove('power-on');
                    bridge1.classList.add('power-off');
                }
                if(deviceStatus.status2){
                    bridge2.setAttribute('val','1');
                    bridge2.classList.remove('power-off');
                    bridge2.classList.add('power-on');
                }else{
                    bridge2.setAttribute('val','0');
                    bridge2.classList.remove('power-on');
                    bridge2.classList.add('power-off');
                }
                if(deviceStatus.status3){
                    bridge3.setAttribute('val','1');
                    bridge3.classList.remove('power-on');
                    bridge3.classList.add('power-off');
                }else{
                    bridge3.setAttribute('val','0');
                    bridge3.classList.remove('power-off');
                    bridge3.classList.add('power-on');
                }
                break;
            case "TOUCHKEY_4B":
                var bridge1 = document.getElementById('bridge1');
                var bridge2 = document.getElementById('bridge2');
                var bridge3 = document.getElementById('bridge3');
                var bridge4 = document.getElementById('bridge4');
                if(deviceStatus.status1){
                    bridge1.setAttribute('val','1');
                    bridge1.classList.remove('power-off');
                    bridge1.classList.add('power-on');
                }else{
                    bridge1.setAttribute('val','0');
                    bridge1.classList.remove('power-on');
                    bridge1.classList.add('power-off');
                }
                if(deviceStatus.status2){
                    bridge2.setAttribute('val','1');
                    bridge2.classList.remove('power-off');
                    bridge2.classList.add('power-on');
                }else{
                    bridge2.setAttribute('val','0');
                    bridge2.classList.remove('power-on');
                    bridge2.classList.add('power-off');
                }
                if(deviceStatus.status3){
                    bridge3.setAttribute('val','1');
                    bridge3.classList.remove('power-on');
                    bridge3.classList.add('power-off');
                }else{
                    bridge3.setAttribute('val','0');
                    bridge3.classList.remove('power-off');
                    bridge3.classList.add('power-on');
                }
                if(deviceStatus.status4){
                    bridge4.setAttribute('val','1');
                    bridge4.classList.remove('power-on');
                    bridge4.classList.add('power-off');
                }else{
                    bridge4.setAttribute('val','0');
                    bridge4.classList.remove('power-off');
                    bridge4.classList.add('power-on');
                }
                break;
            case "VALVE":
                var valve = document.getElementById('valveOnOff');
                if(deviceStatus.status1){
                    valve.checked = true;
                }else{
                    valve.checked = false;
                }
                break;
            case "HEIGHTDETECTOR":
                var heightText = document.getElementById('height');
                if(deviceStatus.height!=null){
                    heightText.innerHTML = message.height;
                }
                break;
            case "WINDOW_DOORSENSOR":
                var windowText = document.getElementById('windowStatus');
                if(deviceStatus.status1){
                    windowText.innerHTML = "بسته است";
                }else{
                    windowText.innerHTML = "باز است";
                }
                break;
            case "CURTAIN":
                var curtainPercent = document.getElementById('curtainValue');
                var curtainRange = document.getElementById('curtainRange');
                if(deviceStatus.percent!=null){
                    curtainPercent.innerHTML = (99 - message.percent) + "%";
                    curtainRange.value = 99 - message.percent;
                }
                break;
                
            default:
                break;
        }
    }
}

function onConnect(){
    console.log('CONNECTED');
    mqtt.subscribe(statusTopic);
    console.log("Subscribed");
    sendStatusandVersionRequest().then(()=>{
        setTimeout(()=>{
          if(!connectionStatus){
              connectStatus.innerHTML = "دستگاه متصل نیست و یا خاموش است";
              version.innerHTML = "خطا در دریافت نسخه دستگاه";
          }
        },5000);
        sendStatus();
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

getDeviceByID(deviceId,uuid,token).then(getDeviceByIDResponse=>{
    getBuilding(getDeviceByIDResponse["data"]["buildingid"],uuid,token).then(getBuildingResponse=>getPlace(getDeviceByIDResponse["data"]["placeid"],uuid,token).then(getPlaceResponse=>{
        fetch(deviceComponents[getDeviceByIDResponse["data"]["type"]]).then(componentResponse=>componentResponse.text().then(deviceHtml=>{
            topic = uuid + "/" + getBuildingResponse["data"]["subtopic"] + "/" + getPlaceResponse["data"]["subtopic"] + "/" + getDeviceByIDResponse["data"]["subtopic"];
            statusTopic = topic + "/status";
            mqttConnect(mqtt);
            deviceDiv.insertAdjacentHTML("beforeend",deviceHtml);
        })).finally(function(){
            switch (getDeviceByIDResponse["data"]["type"]) {
                case "BUZZER":
                    buzzerAction();
                    break;
                case "SOCKET":
                    socketActions();
                    break;
                case "COOLER_KEY":
                    coolerKeyActions();
                    break;
                case "TOUCHKEY":
                    touchkeyOneBridgeActions();
                    break;
                case "TOUCHKEY_2B":
                    touchkeyTwoBridgeActions();
                    break;
                case "TOUCHKEY_3B":
                    touchkeyThreeBridgeActions();
                    break;
                case "TOUCHKEY_4B":
                    touchkeyFourBridgeActions();
                    break;
                case "THERMOSTAT":
                    thermostatTemp = new CircleProgress('#temperatureCirProg',{
                        max:100,
                        value:0,
                        textFormat:function(value){
                            return unicodeDegCel + " " + value;
                        }
                    });
                
                    thermostatHum = new CircleProgress('#humidityCirProg',{
                        max:100,
                        value:0,
                        textFormat:'percent'
                    });
                    break;
                case "FLOWERPOT":
                    potCirProg = new CircleProgress('#potCirProg',{
                        max:100,
                        value:0,
                        textFormat:'percent'
                    });
                    break;
            
                default:
                    break;
            }
        });
    }));
    deviceType = getDeviceByIDResponse["data"]["type"];
    devicePulicNameDiv.innerHTML = devicePublicName[getDeviceByIDResponse["data"]["type"]];
    deviceNameDiv.innerHTML = getDeviceByIDResponse["data"]["name"];
    deviceIconImage.setAttribute("src",deviceIcon[getDeviceByIDResponse["data"]["type"]])
    spinner.classList.remove("show");
});