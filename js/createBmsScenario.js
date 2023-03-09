var bmsScenarioSource = document.getElementById('bmsScenarioSource');
var submitBmsScenario = document.getElementById('submitBmsScenario');



submitBmsScenario.addEventListener('click',function(e){
    e.preventDefault();
    var eui = bmsScenarioSource.options[bmsScenarioSource.selectedIndex].getAttribute('eui');
    var appid = bmsScenarioSource.options[bmsScenarioSource.selectedIndex].getAttribute('appid');
    var sourceDeviceType = bmsScenarioSource.options[bmsScenarioSource.selectedIndex].getAttribute('type');
    var srcTopic = "application/"+ appid +"/device/" + eui + "/event/up";
    var desTopic = "application/" + appid + "/device/" + eui + "/command/down";
    if(sourceDeviceType=="GAS"){
    }
});