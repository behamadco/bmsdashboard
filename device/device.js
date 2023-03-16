import { getBuilding, getDeviceByID, getPlace } from "../js/Functions.js";

var uuid = sessionStorage.getItem("uuid");
var token = sessionStorage.getItem("token");
var username = sessionStorage.getItem("username");
var topic;
var statusTopic;
var connectionStatus = false;
var deviceType;
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

async function sendStatusandVersionRequest(){
    deviceCommands.device="v";
    var message = new Paho.MQTT.Message(JSON.stringify(deviceCommands));
    console.log(topic);
    message.destinationName = topic;
    mqtt.send(message);
}

function onMessageArrived(msg){
    console.log("Message");
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
            default:
                break;
        }
    }
}

function onConnect(){
    console.log('CONNECTED');
    sendStatusandVersionRequest().then(()=>{
        setTimeout(()=>{
          if(!connectionStatus){
              connectStatus.innerHTML = "دستگاه متصل نیست و یا خاموش است";
              version.innerHTML = "خطا در دریافت نسخه دستگاه";
          }
        },5000);
    });
}

function onFailure(){
    console.log("FAILED");
}

function mqttConnect(client){
    var option = {
        userName:"admin",
        password:"admin123",
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
            setTimeout(function(){
                mqtt.subscribe(statusTopic);
                console.log("Subscribed");
            },500);
            deviceDiv.insertAdjacentHTML("beforeend",deviceHtml);
        }));
    }));
    deviceType = getDeviceByIDResponse["data"]["type"];
    switch (getDeviceByIDResponse["data"]["type"]) {
        case "TOUCHKEY_2B":
            
            break;
    
        default:
            break;
    }
    devicePulicNameDiv.innerHTML = devicePublicName[getDeviceByIDResponse["data"]["type"]];
    deviceNameDiv.innerHTML = getDeviceByIDResponse["data"]["name"];
    deviceIconImage.setAttribute("src",deviceIcon[getDeviceByIDResponse["data"]["type"]])
    spinner.classList.remove("show");
});