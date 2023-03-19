var host = "http://185.2.14.188"

var usernameInput = document.getElementById("username");
var passwordInput = document.getElementById("password");
var loginAuthButton = document.getElementById("loginAuthButton");
var spinner = document.getElementById("spinner");

function login(username,password){
    var url = host + "/SmartHomeV3/login";

    var http = new XMLHttpRequest();

    http.onreadystatechange = function(){
        if(this.readyState==4 & this.status==200){
            console.log(this.responseText);
            loginResponse = JSON.parse(this.response);
            if(loginResponse["status"]){
                sessionStorage.setItem("token",loginResponse["data"]["token"]);
                sessionStorage.setItem("username",loginResponse["data"]["username"]);
                sessionStorage.setItem("uuid",loginResponse["data"]["uuid"]);
                sessionStorage.setItem("brokeruser",loginResponse["data"]["brokerUsername"]);
                sessionStorage.setItem("brokerpass",loginResponse["data"]["brokerPassword"]);
            }
            window.location.replace("/dashboard");
        }
    }

    var body = {
        "username":username,
        "password":password
    }

    http.open("POST",url,true);
    http.setRequestHeader("Content-Type","application/json");
    http.send(JSON.stringify(body));
}

spinner.classList.remove("show");

loginAuthButton.addEventListener("click",function(){
    login(usernameInput.value,passwordInput.value);
});