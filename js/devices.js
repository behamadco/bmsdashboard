var deviceType = document.getElementById('deviceType').value;
var deviceId = document.getElementById('deviceId').value;
var token = document.getElementById('token').value;
var topic = document.getElementById('topic').value;
var statusTopic = document.getElementById('statusTopic').value;
var connectStatus = document.getElementById('connectStatus');
var versionStatus = document.getElementById('version');
var updateStatus = document.getElementById('update');
var version = 0;
var connectionState = false;
var mqtt;
var reconnectTimeout = 2000;
var host = "185.2.14.188"
var port = 9001;
let unicodeDegCel = '℃';



console.log(deviceType);

if(deviceType=="FLOWERPOT"){
    var potCirProg = new CircleProgress('#potCirProg',{
        max:100,
        value:0,
        textFormat:'percent'
    });
}

if(deviceType=="THERMOSTAT"){
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

if(deviceType=="DIMMER"){
    const opts = {
        DOMselector: '#cirRange',
        sliders: [
            {
                radius: 100,
                min: 0,
                max: 100,
                step: 1,
                initialValue: 0,
                color: '#0dcaf0',
            },
        ]
    };

    // instantiate the slider
    const slider = new Slider(opts);
    slider.draw();
}

if(deviceType=="BUZZER"){buzzerAction()}
else if(deviceType=="TOUCHKEY"){touchkeyOneBridgeActions()}
else if(deviceType=="TOUCHKEY_2B"){touchkeyTwoBridgeActions()}
else if(deviceType=="TOUCHKEY_3B"){touchkeyThreeBridgeActions()}
else if(deviceType=="COOLER_KEY"){coolerKeyActions()}
else if(deviceType=="SOCKET"){socketActions()}
else if(deviceType=="CURTAIN"){curtainActions()}

function buzzerAction(){
    var buzzerOnOff = document.getElementById('buzzerOnOff');
    buzzerOnOff.addEventListener("change",(e)=>{
        e.preventDefault();
        if(buzzerOnOff.checked){
            commands.command1 = 1;
        }else{
            commands.command1 = 0;
        }
        var message = new Paho.MQTT.Message(JSON.stringify(commands));
        message.destinationName = topic;
        mqtt.send(message);
    });
}

function socketActions(){
    console.log("SOCKET");
    var socket = document.getElementById('socket');
    socket.addEventListener("click",(e)=>{
        e.preventDefault();
        if(socket.getAttribute('val')=="1"){
            commands.command1 = 0;
            socket.classList.remove('power-on');
            socket.classList.add('power-off');
            socket.setAttribute('val','0');
        }else if(socket.getAttribute('val')=="0"){
            commands.command1 = 1;
            socket.classList.remove('power-off');
            socket.classList.add('power-on');
            socket.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(commands));
        message.destinationName = topic;
        mqtt.send(message);
    });
}

function touchkeyOneBridgeActions(){
    var bridgeOnePower = document.getElementById('bridge1');
    bridgeOnePower.addEventListener("click",(e)=>{
        e.preventDefault();
        if(bridgeOnePower.getAttribute('val')=="1"){
            commands.command1 = 0;
            bridgeOnePower.classList.remove('power-on');
            bridgeOnePower.classList.add('power-off');
            bridgeOnePower.setAttribute('val','0');
        }else if(bridgeOnePower.getAttribute('val')=="0"){
            commands.command1 = 1;
            bridgeOnePower.classList.remove('power-off');
            bridgeOnePower.classList.add('power-on');
            bridgeOnePower.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(commands));
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
            commands.command1 = 0;
            bridgeOnePower.classList.remove('power-on');
            bridgeOnePower.classList.add('power-off');
            bridgeOnePower.setAttribute('val','0');
        }else if(bridgeOnePower.getAttribute('val')=="0"){
            commands.command1 = 1;
            bridgeOnePower.classList.remove('power-off');
            bridgeOnePower.classList.add('power-on');
            bridgeOnePower.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(commands));
        message.destinationName = topic;
        mqtt.send(message);
    });
    bridgeTwoPower.addEventListener("click",(e)=>{
        e.preventDefault();
        if(bridgeTwoPower.getAttribute('val')=="1"){
            commands.command2 = 0;
            bridgeTwoPower.classList.remove('power-on');
            bridgeTwoPower.classList.add('power-off');
            bridgeTwoPower.setAttribute('val','0');
        }else if(bridgeTwoPower.getAttribute('val')=="0"){
            commands.command2 = 1;
            bridgeTwoPower.classList.remove('power-off');
            bridgeTwoPower.classList.add('power-on');
            bridgeTwoPower.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(commands));
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
            commands.command1 = 0;
            bridgeOnePower.classList.remove('power-on');
            bridgeOnePower.classList.add('power-off');
            bridgeOnePower.setAttribute('val','0');
        }else if(bridgeOnePower.getAttribute('val')=="0"){
            commands.command1 = 1;
            bridgeOnePower.classList.remove('power-off');
            bridgeOnePower.classList.add('power-on');
            bridgeOnePower.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(commands));
        message.destinationName = topic;
        mqtt.send(message);
    });
    bridgeTwoPower.addEventListener("click",(e)=>{
        e.preventDefault();
        if(bridgeTwoPower.getAttribute('val')=="1"){
            commands.command2 = 0;
            bridgeTwoPower.classList.remove('power-on');
            bridgeTwoPower.classList.add('power-off');
            bridgeTwoPower.setAttribute('val','0');
        }else if(bridgeTwoPower.getAttribute('val')=="0"){
            commands.command2 = 1;
            bridgeTwoPower.classList.remove('power-off');
            bridgeTwoPower.classList.add('power-on');
            bridgeTwoPower.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(commands));
        message.destinationName = topic;
        mqtt.send(message);
    });
    bridgeThreePower.addEventListener("click",(e)=>{
        e.preventDefault();
        if(bridgeOnePower.getAttribute('val')=="1"){
            commands.command3 = 0;
            bridgeThreePower.classList.remove('power-on');
            bridgeThreePower.classList.add('power-off');
            bridgeThreePower.setAttribute('val','0');
        }else if(bridgeOnePower.getAttribute('val')=="0"){
            commands.command3 = 1;
            bridgeThreePower.classList.remove('power-off');
            bridgeThreePower.classList.add('power-on');
            bridgeThreePower.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(commands));
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
            commands.command1 = 0;
            pompPower.classList.remove('power-on');
            pompPower.classList.add('power-off');
            pompPower.setAttribute('val','0');
        }else if(pompPower.getAttribute('val')=="0"){
            commands.command1 = 1;
            pompPower.classList.remove('power-off');
            pompPower.classList.add('power-on');
            pompPower.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(commands));
        message.destinationName = topic;
        mqtt.send(message);
    });
    slowPower.addEventListener("click",(e)=>{
        e.preventDefault();
        if(slowPower.getAttribute('val')=="1"){
            commands.command2 = 0;
            slowPower.classList.remove('power-on');
            slowPower.classList.add('power-off');
            slowPower.setAttribute('val','0');
        }else if(slowPower.getAttribute('val')=="0"){
            commands.command2 = 1;
            slowPower.classList.remove('power-off');
            slowPower.classList.add('power-on');
            slowPower.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(commands));
        message.destinationName = topic;
        mqtt.send(message);
    });
    fastPower.addEventListener("click",(e)=>{
        e.preventDefault();
        if(fastPower.getAttribute('val')=="1"){
            commands.command3 = 0;
            fastPower.classList.remove('power-on');
            fastPower.classList.add('power-off');
            fastPower.setAttribute('val','0');
        }else if(fastPower.getAttribute('val')=="0"){
            commands.command3 = 1;
            fastPower.classList.remove('power-off');
            fastPower.classList.add('power-on');
            fastPower.setAttribute('val','1');
        }
        var message = new Paho.MQTT.Message(JSON.stringify(commands));
        message.destinationName = topic;
        mqtt.send(message);
    });
}

function lockActions(){
    var lock = document.getElementById('openLock');
    lock.addEventListener('click',function(e){
        e.preventDefault();
        commands.command1 = 1;
        var message = new Paho.MQTT.Message(JSON.stringify(commands));
        message.destinationName = topic;
        mqtt.send(message);
    });
}

function curtainActions(){
    var curtainRange = document.getElementById('curtainRange');
    var curtainPercent = document.getElementById('curtainValue');
    curtainRange.addEventListener('change',function(e){
        e.preventDefault();
        commands.data = curtainRange.value;
        curtainPercent.innerHTML = curtainRange.value + "%";
        var message = new Paho.MQTT.Message(JSON.stringify(commands));
        message.destinationName = topic;
        mqtt.send(message);
    });
}


function onMessageArrived(msg){
    var message = JSON.parse(msg.payloadString);
    if(message.version!=null){
        connectionState = true;
        version = message.version;
        // checkVersion(deviceId,version,updateStatus);
        versionStatus.innerHTML = version;
        connectStatus.innerHTML = "متصل"
        connectStatus.classList.remove('not-connect');
        connectStatus.classList.add('connectivity');
    }
    if(message.version==null){
        console.log(message);
        switch(deviceType){
            case "BUZZER":
                var buzzerCheck = document.getElementById('buzzerOnOff');
                if(message.status1){
                    buzzerCheck.checked = true;
                }else{
                    buzzerCheck.checked = false;
                }
                break;
            case "COOLER_KEY":
                var pomp = document.getElementById('pomp');
                var slow = document.getElementById('slow');
                var fast = document.getElementById('fast');
                if(message.status1){
                    pomp.setAttribute('val',"1");
                    pomp.classList.remove("power-off");
                    pomp.classList.add("power-on");
                }else{
                    pomp.setAttribute('val','0');
                    pomp.classList.remove("power-on");
                    pomp.classList.add("power-off");
                }
                if(message.status2){
                    slow.setAttribute('val',"1");
                    slow.classList.remove("power-off");
                    slow.classList.add("power-on");
                }else{
                    slow.setAttribute('val','0');
                    slow.classList.remove("power-on");
                    slow.classList.add("power-off");
                }
                if(message.status3){
                    fast.setAttribute('val',"1");
                    fast.classList.remove("power-off");
                    fast.classList.add("power-on");
                }else{
                    fast.setAttribute('val','0');
                    fast.classList.remove("power-on");
                    fast.classList.add("power-off");
                }
                break;
            case "FLOWERPOT":
                potCirProg.value = message.pot
                break;
            case "SENSOR":
                var mq2Status = document.getElementById('mq2Status');
                var progress = document.getElementById('mq2Progress');
                if(message.mq2!=null){
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
                if(message.status1){
                    lockButton.classList.remove('btn-danger');
                    lockButton.classList.add('btn-warning');
                }else{
                    lockButton.classList.remove('btn-warning');
                    lockButton.classList.add('btn-danger');
                }
                break;
            case "MOTIONDETECTOR":

                break;
            case "POWER":
                break;
            case "SOCKET":
                var socket = document.getElementById('socket');
                if(message.status1){
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
                if(message.temperature!=null){
                    var temp = message.temperature;
                    thermostatTemp.value = temp;
                }
                if(message.humidity!=null){
                    var hum = message.humidity;
                    thermostatHum.value = hum;
                }
                break;
            case "TOUCHKEY":
                var bridge1 = document.getElementById('bridge1');
                if(message.status1){
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
                if(message.status1){
                    bridge1.setAttribute('val','1');
                    bridge1.classList.remove('power-off');
                    bridge1.classList.add('power-on');
                }else{
                    bridge1.setAttribute('val','0');
                    bridge1.classList.remove('power-on');
                    bridge1.classList.add('power-off');
                }
                if(message.status2){
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
                if(message.status1){
                    bridge1.setAttribute('val','1');
                    bridge1.classList.remove('power-off');
                    bridge1.classList.add('power-on');
                }else{
                    bridge1.setAttribute('val','0');
                    bridge1.classList.remove('power-on');
                    bridge1.classList.add('power-off');
                }
                if(message.status2){
                    bridge2.setAttribute('val','1');
                    bridge2.classList.remove('power-off');
                    bridge2.classList.add('power-on');
                }else{
                    bridge2.setAttribute('val','0');
                    bridge2.classList.remove('power-on');
                    bridge2.classList.add('power-off');
                }
                if(message.status3){
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
                if(message.status1){
                    bridge1.setAttribute('val','1');
                    bridge1.classList.remove('power-off');
                    bridge1.classList.add('power-on');
                }else{
                    bridge1.setAttribute('val','0');
                    bridge1.classList.remove('power-on');
                    bridge1.classList.add('power-off');
                }
                if(message.status2){
                    bridge2.setAttribute('val','1');
                    bridge2.classList.remove('power-off');
                    bridge2.classList.add('power-on');
                }else{
                    bridge2.setAttribute('val','0');
                    bridge2.classList.remove('power-on');
                    bridge2.classList.add('power-off');
                }
                if(message.status3){
                    bridge3.setAttribute('val','1');
                    bridge3.classList.remove('power-on');
                    bridge3.classList.add('power-off');
                }else{
                    bridge3.setAttribute('val','0');
                    bridge3.classList.remove('power-off');
                    bridge3.classList.add('power-on');
                }
                if(message.status4){
                    bridge4.setAttribute('val','1');
                    bridge4.classList.remove('power-on');
                    bridge4.classList.add('power-off');
                }else{
                    bridge4.setAttribute('val','0');
                    bridge4.classList.remove('power-off');
                    bridge4.classList.add('power-on');
                }
                break;
            case "TOUCHKEY_16B":
                break;
            case "VALVE":
                var valve = document.getElementById('valveOnOff');
                if(message.status1){
                    valve.checked = true;
                }else{
                    valve.checked = false;
                }
                break;
            case "HEIGHTDETECTOR":
                var heightText = document.getElementById('height');
                if(message.height!=null){
                    heightText.innerHTML = message.height;
                }
                break;
            case "WINDOW_DOORSENSOR":
                var windowText = document.getElementById('windowStatus');
                if(message.status1){
                    windowText.innerHTML = "بسته است";
                }else{
                    windowText.innerHTML = "باز است";
                }
                break;
            case "CURTAIN":
                var curtainPercent = document.getElementById('curtainValue');
                var curtainRange = document.getElementById('curtainRange');
                if(message.percent!=null){
                    curtainPercent.innerHTML = (99 - message.percent) + "%";
                    curtainRange.value = 99 - message.percent;
                }
                break;
            case "DIMMER":
                break;
        }
    }
}

function onConnect(){
    console.log('CONNECTED');
    mqtt.subscribe(statusTopic);
    commands.command1 = "s";
    commands.device="v";
    var message = new Paho.MQTT.Message(JSON.stringify(commands));
    message.destinationName = topic;
    mqtt.send(message);

    setTimeout(function(){
        if(connectionState == false){
            connectStatus.innerHTML = "دستگاه متصل نیست و یا خاموش است";
            versionStatus.innerHTML = "خطا در دریافت نسخه دستگاه";
        }
    }, 10000);
}

function onFailure(){
    console.log("FAILED");
}

function mqttConnect(){
    mqtt = new Paho.MQTT.Client(host,port,"BMS Dash");
    var option = {
        userName:"admin",
        password:"admin123",
        timeout:3,
        onSuccess: onConnect,
        onFailure:onFailure
    }
    mqtt.onMessageArrived = onMessageArrived;
    mqtt.connect(option);

}

async function checkVersion(deviceId,version,element){
    var url = "https://185.2.14.188/SmartHomeV3/checkDeviceVersion";
    var httpClient = new XMLHttpRequest();
    httpClient.onreadystatechange = function(){
        if(this.readyState==4 && this.status==200){
            console.log(this.response);
            var response = JSON.parse(this.response);
            if(response['status'] && response['message']=="Updateble"){
                element.style.display = "inline-block";
            }
        }
    }
    var body = {
        "deviceid":deviceId,
        "deviceversion":version
    }
    console.log(body);
    httpClient.open("POST",url,true);
    httpClient.setRequestHeader("Content-type", "application/json");
    httpClient.setRequestHeader("Authorization","Token "+token);
    httpClient.send(JSON.stringify(body));
}

var commands = {
    "command1":"x",
    "command2":"x",
    "command3":"x",
    "command4":"x",
    "device":"x",
    "data":"x",
    "did":0,
    "min":0,
    "max":0
}

mqttConnect();