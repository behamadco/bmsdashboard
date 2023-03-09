<?php
    header("Content-Type:application/json");

    if($_SERVER['REQUEST_METHOD']=="POST"){
        $uid = $_POST["uid"];
        if($uid=="D01F3B21"){
            http_response_code(200);
            $success_message['status']=true;
            $success_message['message'] = "Allowed";
            echo json_encode($success_message);
        }else{
            http_response_code(200);
            $success_message['status']=false;
            $success_message['message'] = "Not Allowed";
            echo json_encode($success_message);
        }
    }
?>