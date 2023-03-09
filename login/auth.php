<?php
    include "./Functions.php";
    $username = $_POST['username'];
    $password = $_POST['password'];
    if($_SERVER['REQUEST_METHOD']=="POST"){
        $loginResponse = login($username,$password);
        if($loginResponse){
            $userData = $loginResponse -> data;
            $_SESSION['behamad_username'] = $username;
            $_SESSION['behamad_password'] = $password;
            $_SESSION['behamad_name'] = $userData -> name;
            $_SESSION['behamad_uuid'] = $userData -> uuid;
            $_SESSION['behamad_brokerAddress'] = $userData -> brokerAddress;
            $_SESSION['behamad_brokerPassword'] = $userData -> brokerPassword;
            $_SESSION['behamad_token'] = $userData -> token;

            header('Location: dashboard');
        }
        else{
            header ('Location: login');
        }
    }
?>