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