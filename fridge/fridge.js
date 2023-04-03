import { getAllFridges, getAllNotification } from "../js/Functions.js";

var uuid = sessionStorage.getItem("uuid");
var token = sessionStorage.getItem("token");
var username = sessionStorage.getItem("username");

var bmsDeviceDiv = document.getElementById("fridgeDiv");
var usernameElement = document.getElementById("username");
var spinner = document.getElementById("spinner");

usernameElement.innerHTML = username;

getAllNotification(uuid,token).then(res =>{
    fetch("/publicComponents/notificationRow.html").then(componentResponse=>componentResponse.text().then(notificationHtml=>{
        for(var index in res["data"]){
            notificationDiv.insertAdjacentHTML("beforeend", notificationHtml.replace("#notificationText",res["data"][index]["subject"]));
        }
    })).finally(()=>{notificationDiv.innerHTML += "<a href='#' class='dropdown-item text-center'>دیدن همه اطلاعیه ها</a>"});
});

getAllFridges(uuid,token).then(getAllFridgesResponse=>{
    fetch("components/deviceRow.html").then(componentResponse=>componentResponse.text().then(fridgeHtml=>{
        var devicesElemenets = [];
        for(var index in getAllFridgesResponse["data"]){
            bmsDeviceDiv.insertAdjacentHTML("beforeend",fridgeHtml.replace("#fridgeName",getAllFridgesResponse["data"][index]["name"]).replace("#fridgeId",getAllFridgesResponse["data"][index]["id"]));
            var eventListenerElemenet = document.getElementById(getAllFridgesResponse["data"][index]["id"])
            if(eventListenerElemenet!=null){
                devicesElemenets.push(eventListenerElemenet);
            }
        }
        return devicesElemenets;

    })).then(elementResponse=>{
        elementResponse.forEach(function(element) {
            element.addEventListener("click",function(e){
                e.preventDefault();
                localStorage.setItem("fridgeDevicePage",this.getAttribute("id"))
                location.replace("/fridgeDevice")
            },false);
        })
    });
    spinner.classList.remove("show");
});