var username = sessionStorage.getItem("username");
var uuid = sessionStorage.getItem("uuid");
var token = sessionStorage.getItem("token");

var host = "http://185.2.14.188";

function subTopicGenerator(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

export function codeGenerator(length) {
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

export function sendMQTTMessage(mqtt,topic,did,key,command){
    var deviceCommands = {
        "command1":"x",
        "command2":"x",
        "command3":"x",
        "command4":"x",
        "device":"x",
        "data":"x",
        "did":did,
        "min":0,
        "max":0
    };

    deviceCommands[key] = command;
    var message = new Paho.MQTT.Message(JSON.stringify(deviceCommands));
    message.destinationName = topic;
    mqtt.send(message);
}

function sendBmsMQTTMessage(mqtt, devEUI, topic, channel, command, systemParamType, SerialNumber, obisParamType, interval, angle){
    var bmsCommand = {
        "confirmed": true,
        "fPort": 1,
        "devEui": devEUI,
        "object": {
          "Channel": channel,
          "Command": command,
          "SystemParamType": systemParamType,
          "SerialNumber": SerialNumber,
          "OBISParamType": obisParamType,
          "Interval": interval,
          "Angle": angle
        }
    }

    var message = new Paho.MQTT.Message(JSON.stringify(bmsCommand));
    message.destinationName = topic;
    mqtt.send(message);
}


export function sendBMSMQTTRelayMessage(mqtt, devEUI, topic, channel, command){
    sendBmsMQTTMessage(mqtt,devEUI,topic,channel,command, "", "", "", 0, 0)
}

export function sendDHTMQTTReadCommand(mqtt, devEUI, topic){
    sendBmsMQTTMessage(mqtt, devEUI, topic, "DHT22", "READ", "", "", "", 0, 0)
}

export function sendDHTMQTTPeriodicStart(mqtt, devEUI, topic){
    sendBmsMQTTMessage(mqtt, devEUI, topic, "DHT22", "START_PERIODIC_READ", "", "", "", 0, 0)
}

export function sendDHTMQTTPeriodicInterval(mqtt, devEUI, topic, interval){
    sendBmsMQTTMessage(mqtt, devEUI, topic, "DHT22", "CHANGE_READ_INTERVAL", "", "", "", interval, 0)
}

export function sendServoMQTTOpenCommand(mqtt, devEUI, topic){
    sendBmsMQTTMessage(mqtt, devEUI, topic, "SERVO", "OPEN", "", "", "", 0, 0)
}

export function sendServoMQTTCloseCommand(mqtt, devEUI, topic){
    sendBmsMQTTMessage(mqtt, devEUI, topic, "SERVO", "CLOSE", "", "", "", 0, 0)
}

export function sendServoMQTTChangeAngleCommand(mqtt, devEUI, topic, angle){
    sendBmsMQTTMessage(mqtt, devEUI, topic, "SERVO", "CHANGE_SERVO_ANGLE", "", "", "", 0, angle)
}

export function sendRS485MQTTStartPeriodic(mqtt, devEUI, topic, serialNumber){
    sendBmsMQTTMessage(mqtt, devEUI, topic, "RS485", "START_PERIODIC_READ", "", serialNumber, "", 0, 0)
}

export function sendRS485MQTTStopPeriodic(mqtt, devEUI, topic, serialNumber){
    sendBmsMQTTMessage(mqtt, devEUI, topic, "RS485", "STOP_PERIODIC_READ", "", serialNumber, "", 0, 0)
}

export function sendRS485MQTTChangePeriodicInterval(mqtt, devEUI, topic, serialNumber, interval){
    sendBmsMQTTMessage(mqtt, devEUI, topic, "RS485", "CHANGE_READ_INTERVAL", "", serialNumber, "", interval, 0)
}

export function sendRS485MQTTAddParameter(mqtt, devEUI, topic, serialNumber, obisParamType){
    sendBmsMQTTMessage(mqtt, devEUI, topic, "RS485", "ADD_OBIS_PARAM_TO_READ", "", serialNumber, obisParamType, 0, 0)
}

export function sendRS485MQTTRemoveParameter(mqtt, devEUI, topic, serialNumber, obisParamType){
    sendBmsMQTTMessage(mqtt, devEUI, topic, "RS485", "REMOVE_OBIS_PARAM_FROM_READ", "", serialNumber, obisParamType, 0, 0)
}

export function getBuildings(uuid,token){
    var url = host + "/SmartHomeV3/getAllBuildings"

    var http = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        http.onreadystatechange = function(){
            if(this.readyState==4 & this.status==200){
                resolve(JSON.parse(this.response));
            }
        }

        var body = {
            "useruuid": uuid
        }

        http.open("POST",url,true);
        http.setRequestHeader("Content-Type","application/json");
        http.setRequestHeader("Authorization","Token "+token)
        http.send(JSON.stringify(body));
    });
}


export async function getAllDevices(uuid,token){
    var url = host + "/SmartHomeV3/getAllDevices"

    var http = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        http.onreadystatechange = function(){
            if(this.readyState==4 & this.status==200){
                resolve(JSON.parse(this.response));
            }
        }

        var body = {
            "useruuid": uuid
        }

        http.open("POST",url,true);
        http.setRequestHeader("Content-Type","application/json");
        http.setRequestHeader("Authorization","Token "+token)
        http.send(JSON.stringify(body));
    });
}

export function getLastLogin(uuid,token){
    var url = host + "/SmartHomeV3/getLastLogin"

    var http = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        http.onreadystatechange = function(){
            if(this.readyState==4 & this.status==200){
                resolve(JSON.parse(this.response));
            }
        }
    
        var body = {
            "token": token
        }
    
        http.open("POST",url,true);
        http.setRequestHeader("Content-Type","application/json");
        http.setRequestHeader("Authorization","Token "+token)
        http.send(JSON.stringify(body));
    });
}

export function getAllScenarios(uuid,token){
    var url = host + "/SmartHomeV3/getAllScenarios"

    var http = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        http.onreadystatechange = function(){
            if(this.readyState==4 & this.status==200){
                resolve(JSON.parse(this.response));
            }
        }
    
        var body = {
            "useruuid": uuid
        }
    
        http.open("POST",url,true);
        http.setRequestHeader("Content-Type","application/json");
        http.setRequestHeader("Authorization","Token "+token)
        http.send(JSON.stringify(body));
    });
}

export function getQuickAccessDevices(uuid,token){
    var url = host + "/SmartHomeV3/getAllQuickAccessDevices"

    var http = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        http.onreadystatechange = function(){
            if(this.readyState==4 & this.status==200){
                resolve(JSON.parse(this.response));
            }
        }
    
        var body = {
            "useruuid": uuid
        }
    
        http.open("POST",url,true);
        http.setRequestHeader("Content-Type","application/json");
        http.setRequestHeader("Authorization","Token "+token)
        http.send(JSON.stringify(body));
    });
}

export function getAllNotification(uuid,token){
    var url = host + "/SmartHomeV3/getNotifications"

    var http = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        http.onreadystatechange = function(){
            if(this.readyState==4 & this.status==200){
                resolve(JSON.parse(this.response));
            }
        }
    
        var body = {
            "useruuid": uuid
        }
    
        http.open("POST",url,true);
        http.setRequestHeader("Content-Type","application/json");
        http.setRequestHeader("Authorization","Token "+token)
        http.send(JSON.stringify(body));
    });
}

export function getDeviceByID(deviceId,uuid,token){
    var url = host + "/SmartHomeV3/getDeviceByid"

    var http = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        http.onreadystatechange = function(){
            if(this.readyState==4 & this.status==200){
                resolve(JSON.parse(this.response));
            }
        }
    
        var body = {
            "deviceid": deviceId,
            "useruuid": uuid
        }
    
        http.open("POST",url,true);
        http.setRequestHeader("Content-Type","application/json");
        http.setRequestHeader("Authorization","Token "+token)
        http.send(JSON.stringify(body));
    });
}


export function deleteDevice(deviceId,uuid,token){
    var url = host + "/SmartHomeV3/deleteDevice"

    var http = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        http.onreadystatechange = function(){
            if(this.readyState==4 & this.status==200){
                resolve(JSON.parse(this.response));
            }
        }
    
        var body = {
            "deviceid": deviceId,
            "useruuid": uuid
        }
    
        http.open("POST",url,true);
        http.setRequestHeader("Content-Type","application/json");
        http.setRequestHeader("Authorization","Token "+token)
        http.send(JSON.stringify(body));
    });
}

export function modifyDevice(deviceNewName,deviceId,uuid,token){
    var url = host + "/SmartHomeV3/modifyDevice"

    var http = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        http.onreadystatechange = function(){
            if(this.readyState==4 & this.status==200){
                resolve(JSON.parse(this.response));
            }
        }
    
        var body = {
            "devicenewname":deviceNewName,
            "deviceid": deviceId,
            "useruuid": uuid
        }
    
        http.open("POST",url,true);
        http.setRequestHeader("Content-Type","application/json");
        http.setRequestHeader("Authorization","Token "+token)
        http.send(JSON.stringify(body));
    });
}


export function getBuilding(buildingId,uuid,token){
    var url = host + "/SmartHomeV3/getBuilding"

    var http = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        http.onreadystatechange = function(){
            if(this.readyState==4 & this.status==200){
                resolve(JSON.parse(this.response));
            }
        }
    
        var body = {
            "buildingid": buildingId,
            "useruuid": uuid
        }
    
        http.open("POST",url,true);
        http.setRequestHeader("Content-Type","application/json");
        http.setRequestHeader("Authorization","Token "+token)
        http.send(JSON.stringify(body));
    });
}

export function getPlace(placeId,uuid,token){
    var url = host + "/SmartHomeV3/getPlace"

    var http = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        http.onreadystatechange = function(){
            if(this.readyState==4 & this.status==200){
                resolve(JSON.parse(this.response));
            }
        }
    
        var body = {
            "placeid": placeId,
            "useruuid": uuid
        }
    
        http.open("POST",url,true);
        http.setRequestHeader("Content-Type","application/json");
        http.setRequestHeader("Authorization","Token "+token)
        http.send(JSON.stringify(body));
    });
}


export function createScenario(name,action,condition,sourceKey,sourceValue,destinationKey,deviceId,sourceDeviceId,destinationDeviceId,setPoint,notify,status,sms,uuid,token){
    var url = host + "/SmartHomeV3/createScenario"

    var http = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        http.onreadystatechange = function(){
            if(this.readyState==4 & this.status==200){
                resolve(JSON.parse(this.response));
            }
        }
    
        var body = {
            "name":name,
            "action":action,
            "condition":condition,
            "sourcekey":sourceKey,
            "sourcevalue":sourceValue,
            "destinationkey":destinationKey,
            "deviceid":deviceId,
            "sourcedeviceid":sourceDeviceId,
            "destinationdeviceid":destinationDeviceId,
            "setpoint":setPoint,
            "notify":notify,
            "status":status,
            "sms":sms,
            "useruuid": uuid
        }
    
        http.open("POST",url,true);
        http.setRequestHeader("Content-Type","application/json");
        http.setRequestHeader("Authorization","Token "+token)
        http.send(JSON.stringify(body));
    });
}


export function createSecurityScenario(name,alarmDeviceId,windowDeviceId,pirDeviceId,securityCode,uuid,token){
    var url = host + "/SmartHomeV3/createSecurityDefaultScenario"

    var http = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        http.onreadystatechange = function(){
            if(this.readyState==4 & this.status==200){
                resolve(JSON.parse(this.response));
            }
        }
    
        var body = {
            "scenarioname":name,
            "alarmdeviceid":alarmDeviceId,
            "doorsensordeviceid":windowDeviceId,
            "pirsensordeviceid":pirDeviceId,
            "securitycode": securityCode,
            "notifymode":"both",
            "useruuid": uuid
        }
    
        http.open("POST",url,true);
        http.setRequestHeader("Content-Type","application/json");
        http.setRequestHeader("Authorization","Token "+token)
        http.send(JSON.stringify(body));
    });
}

export function getScenarios(uuid,token){
    var url = host + "/SmartHomeV3/getAllScenarios"

    var http = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        http.onreadystatechange = function(){
            if(this.readyState==4 & this.status==200){
                resolve(JSON.parse(this.response));
            }
        }
    
        var body = {
            "useruuid": uuid
        }
    
        http.open("POST",url,true);
        http.setRequestHeader("Content-Type","application/json");
        http.setRequestHeader("Authorization","Token "+token)
        http.send(JSON.stringify(body));
    });
}


export function getSchedules(uuid,token){
    var url = host + "/SmartHomeV3/getAllSchedules"

    var http = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        http.onreadystatechange = function(){
            if(this.readyState==4 & this.status==200){
                resolve(JSON.parse(this.response));
            }
        }
    
        var body = {
            "useruuid": uuid
        }
    
        http.open("POST",url,true);
        http.setRequestHeader("Content-Type","application/json");
        http.setRequestHeader("Authorization","Token "+token)
        http.send(JSON.stringify(body));
    });
}

export function getAllSecurityScenarios(uuid,token){
    var url = host + "/SmartHomeV3/getSecutityDefaultScenario";

    var http = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        http.onreadystatechange = function(){
            if(this.readyState==4 & this.status==200){
                resolve(JSON.parse(this.response));
            }
        }
    
        var body = {
            "useruuid": uuid
        }
    
        http.open("POST",url,true);
        http.setRequestHeader("Content-Type","application/json");
        http.setRequestHeader("Authorization","Token "+token)
        http.send(JSON.stringify(body));
    });
}


export function getAllTravelScenario(uuid,token){
    var url = host + "/SmartHomeV3/getAllTravelScenarios";

    var http = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        http.onreadystatechange = function(){
            if(this.readyState==4 & this.status==200){
                resolve(JSON.parse(this.response));
            }
        }
    
        var body = {
            "useruuid": uuid
        }
    
        http.open("POST",url,true);
        http.setRequestHeader("Content-Type","application/json");
        http.setRequestHeader("Authorization","Token "+token)
        http.send(JSON.stringify(body));
    });
}

export function getAllBmsDevices(uuid,token){
    var url = host + "/BuildingManagementSystem/getBmsDevices"

    var http = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        http.onreadystatechange = function(){
            if(this.readyState==4 & this.status==200){
                resolve(JSON.parse(this.response));
            }
        }
    
        var body = {
            "useruuid": uuid
        }
    
        http.open("POST",url,true);
        http.setRequestHeader("Content-Type","application/json");
        http.setRequestHeader("Authorization","Token "+token)
        http.send(JSON.stringify(body));
    });
}

export function getBmsSubDevices(devEui,uuid,token){
    var url = host + "/BuildingManagementSystem/getSubDevices"

    var http = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        http.onreadystatechange = function(){
            if(this.readyState==4 & this.status==200){
                resolve(JSON.parse(this.response));
            }
        }
    
        var body = {
            "deveui": devEui,
            "useruuid": uuid
        }
    
        http.open("POST",url,true);
        http.setRequestHeader("Content-Type","application/json");
        http.setRequestHeader("Authorization","Token "+token)
        http.send(JSON.stringify(body));
    });
}

export function getBmsDevice(devEui,uuid,token){
    var url = host + "/BuildingManagementSystem/getBmsDevice"

    var http = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        http.onreadystatechange = function(){
            if(this.readyState==4 & this.status==200){
                resolve(JSON.parse(this.response));
            }
        }
    
        var body = {
            "deveui": devEui,
            "useruuid": uuid
        }
    
        http.open("POST",url,true);
        http.setRequestHeader("Content-Type","application/json");
        http.setRequestHeader("Authorization","Token "+token)
        http.send(JSON.stringify(body));
    });
}


export function getAllFridges(uuid,token){
    var url = host + "/SmartFridge/getAllFridges"

    var http = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        http.onreadystatechange = function(){
            if(this.readyState==4 & this.status==200){
                resolve(JSON.parse(this.response));
            }
        }
    
        var body = {
            "useruuid": uuid
        }
    
        http.open("POST",url,true);
        http.setRequestHeader("Content-Type","application/json");
        http.setRequestHeader("Authorization","Token "+token)
        http.send(JSON.stringify(body));
    });
}

export function getFridge(fridgeId,uuid,token) {
    var url = host + "/SmartFridge/getFridge";

    var http = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        http.onreadystatechange = function(){
            if(this.readyState==4 & this.status==200){
                resolve(JSON.parse(this.response));
            }
        }
    
        var body = {
            "fridgeid": fridgeId,
            "useruuid": uuid
        }
    
        http.open("POST",url,true);
        http.setRequestHeader("Content-Type","application/json");
        http.setRequestHeader("Authorization","Token "+token)
        http.send(JSON.stringify(body));
    });
}

export function getTemperatureToday(fridgeId,uuid,token) {
    var url = host + "/SmartFridge/getTemperatureBetweenDates";

    var http = new XMLHttpRequest();

    return new Promise((resolve,reject)=>{
        http.onreadystatechange = function(){
            if(this.readyState==4 & this.status==200){
                resolve(JSON.parse(this.response));
            }
        }

        var date = new Date();

        var startDate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + "00" + ":" + "00" + ":" + "00";
        var endDate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + "23" + ":" + "59" + ":" + "59";
    
        var body = {
            "fridgeid": fridgeId,
            "startdate": startDate,
            "enddate": endDate,
            "useruuid": uuid
        }

    
        http.open("POST",url,true);
        http.setRequestHeader("Content-Type","application/json");
        http.setRequestHeader("Authorization","Token "+token)
        http.send(JSON.stringify(body));
    });
}