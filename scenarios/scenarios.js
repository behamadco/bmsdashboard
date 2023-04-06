import { getAllNotification } from "../js/Functions.js";

var spinner = document.getElementById("spinner");
var uuid = sessionStorage.getItem("uuid");
var token = sessionStorage.getItem("token");

getAllNotification(uuid,token).then(res =>{
    fetch("/publicComponents/notificationRow.html").then(componentResponse=>componentResponse.text().then(notificationHtml=>{
        for(var index in res["data"]){
            notificationDiv.insertAdjacentHTML("beforeend", notificationHtml.replace("#notificationText",res["data"][index]["subject"]));
        }
    })).finally(()=>{notificationDiv.innerHTML += "<a href='#' class='dropdown-item text-center'>دیدن همه اطلاعیه ها</a>"});
}).finally(()=>{
    spinner.classList.remove("show");
});
