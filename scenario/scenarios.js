import { getAllNotification, getAllScenarios, getAllSecurityScenarios, getAllTravelScenario, getSchedules } from "../js/Functions.js";

var spinner = document.getElementById("spinner");
var uuid = sessionStorage.getItem("uuid");
var token = sessionStorage.getItem("token");


var publicScenarioList = document.getElementById("publicScenario");

getAllNotification(uuid,token).then(res =>{
    fetch("/publicComponents/notificationRow.html").then(componentResponse=>componentResponse.text().then(notificationHtml=>{
        for(var index in res["data"]){
            notificationDiv.insertAdjacentHTML("beforeend", notificationHtml.replace("#notificationText",res["data"][index]["subject"]));
        }
    })).finally(()=>{notificationDiv.innerHTML += "<a href='#' class='dropdown-item text-center'>دیدن همه اطلاعیه ها</a>"});
}).finally(()=>{
    spinner.classList.remove("show");
});


getAllScenarios(uuid, token).then(getAllScenariosResponse=>{
    var scenarioData = getAllScenariosResponse["data"];
    getSchedules(uuid,token).then(getSchedulesResponse=>{
        var scheduleData = getSchedulesResponse["data"];
            getAllSecurityScenarios(uuid,token).then(getSecurityScenariosResponse=>{
                var securityScenarioData = getSecurityScenariosResponse["data"];
                getAllTravelScenario(uuid,token).then(getAllTravelerScenarioResponse=>{
                    var travelScenarioData = getAllTravelerScenarioResponse["data"];
                    fetch("components/scenarioRow.html").then(componentResponse=>{componentResponse.text().then(scenarioHtml=>{
                        for(var index in scenarioData){
                            var currentScenario = scenarioData[index];
                            publicScenarioList.insertAdjacentHTML("beforeend",scenarioHtml.replace("#scenarioName",currentScenario["name"]).replace("#scenarioType","سناریو عمومی"));
                        }
                    })});
                    fetch("components/scenarioRow.html").then(componentResponse=>{componentResponse.text().then(scenarioHtml=>{
                        for(var index in scheduleData){
                            var currentSchedule = scheduleData[index];
                            publicScenarioList.insertAdjacentHTML("beforeend", scenarioHtml.replace("#scenarioName",currentSchedule["name"]).replace("#scenarioType","زمانبندی"));
                        }
                    })});
                    fetch("components/scenarioRow.html").then(componentResponse=>{componentResponse.text().then(scenarioHtml=>{
                        for(var index in securityScenarioData){
                            var currentSecurity = securityScenarioData[index];
                            publicScenarioList.insertAdjacentHTML("beforeend", scenarioHtml.replace("#scenarioName",currentSecurity["name"]).replace("#scenarioType","سناریو امنیتی"));
                        }
                    })});
                    fetch("components/scenarioRow.html").then(componentResponse=>{componentResponse.text().then(scenarioHtml=>{
                        for(var index in securityScenarioData){
                            var currentTravelScenario = travelScenarioData[index];
                            publicScenarioList.insertAdjacentHTML("beforeend", scenarioHtml.replace("#scenarioName",currentTravelScenario["name"]).replace("#scenarioType","سناریو سفر"));
                        }
                    })});
                });
            });
    });
});