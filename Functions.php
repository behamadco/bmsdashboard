<?php
    global $mainURL;
    $mainURL = "http://185.2.14.188/SmartHomeV3";
    $bmsURL = "http://185.2.14.188/BuildingManagementSystem";

    function login($username,$password){
        $url = $GLOBALS["mainURL"] . "/login";
        $parameters = "username=$username&password=$password";
        $headers = [
            "Content-Type:application/x-www-form-urlencoded",
        ];
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS,$parameters);
        curl_setopt($curl,CURLOPT_HTTPHEADER,$headers);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $response = json_decode(curl_exec($curl));
        curl_close($curl);
        return $response;
    }
    
    function getLastLogin($token){
        global $mainURL;
        $url = $GLOBALS['mainURL'] . "/getLastLogin";
        $headers = [
            "Content-Type:application/json",
            "Authorization:Token ". $token,
        ];

        $parameters = array(
            "token" => $token
        );
       // $parameters = "token=$token";
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS,json_encode($parameters));
        curl_setopt($curl,CURLOPT_HTTPHEADER,$headers);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $response = json_decode(curl_exec($curl));
        curl_close($curl);
        return $response;
    }

    function getAllBuildings($userUuid,$token){
        global $mainURL;
        $url = $GLOBALS['mainURL'] . "/getAllBuildings";
        $headers = [
            "Content-Type: application/json",
            "Authorization: Token ". $token,
        ];

        $parameters = array(
            "useruuid" => $userUuid
        );

        $curl = curl_init();
        
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS,json_encode($parameters));
        curl_setopt($curl, CURLOPT_HTTPHEADER,$headers);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        $response = json_decode(curl_exec($curl));
        curl_close($curl);
        return $response;
    }

    function getBuildingPlaces($buildingId,$userUuid,$token){
        global $mainURL;
        $url = $mainURL . "/getPlaces";

        $headers = [
            "Content-Type: application/json",
            "Authorization: Token ". $token
        ];

        $parameters = array(
            "buildingid" => $buildingId,
            "useruuid" => $userUuid
        );

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS,json_encode($parameters));
        curl_setopt($curl,CURLOPT_HTTPHEADER,$headers);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $response = json_decode(curl_exec($curl));
        curl_close($curl);
        return $response;
    }

    function getPlaceDevices($placeId,$useruuid,$token){
        global $mainURL;
        $url = $mainURL . "/getDevicesByPlace";
        
        $headers = [
            "Content-Type: application/json",
            "Authorization: Token ". $token,
        ];
        $parameters = array(
            "placeid"=>$placeId,
            "useruuid"=>$useruuid
        );
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS,json_encode($parameters));
        curl_setopt($curl,CURLOPT_HTTPHEADER,$headers);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $response = json_decode(curl_exec($curl));
        curl_close($curl);
        return $response;
    }

    function getAllDevices($userUuid,$token){
        global $mainURL;
        $url = $GLOBALS['mainURL'] . "/getAllDevices";
        
        $headers = [
            "Content-Type: application/json",
            "Authorization: Token ". $token,
        ];
        
        $parameters = array(
            "useruuid"=>$userUuid,
        );
        
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS,json_encode($parameters));
        curl_setopt($curl, CURLOPT_HTTPHEADER,$headers);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $response = json_decode(curl_exec($curl));
        curl_close($curl);
        return $response;
    }

    function getDevice($deviceId,$userUuid,$token){
        global $mainURL;
        $url = $GLOBALS['mainURL'] . "/getDeviceByid";
        $headers = [
            "Content-Type: application/json",
            "Authorization: Token ". $token,
        ];

        $parameters = array(
            "deviceid"=>$deviceId,
            "useruuid"=>$userUuid
        );

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS,json_encode($parameters));
        curl_setopt($curl,CURLOPT_HTTPHEADER,$headers);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $response = json_decode(curl_exec($curl));
        curl_close($curl);
        return $response;
    }

    function getBuilding($buildingId,$userUuid,$token){
        global $mainURL;
        $url = $GLOBALS['mainURL'] . "/getBuilding";
        
        $headers = [
            "Content-Type: application/json",
            "Authorization: Token ". $token,
        ];
        
        $parameters = array(
            "buildingid"=>$buildingId,
            "useruuid"=>$userUuid,
        );
        
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS,json_encode($parameters));
        curl_setopt($curl,CURLOPT_HTTPHEADER,$headers);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $response = json_decode(curl_exec($curl));
        curl_close($curl);
        return $response;
    }

    function getPlace($placeId,$userUuid,$token){
        global $mainURL;
        $url = $GLOBALS['mainURL'] . "/getPlace";

        $headers = [
            "Content-Type: application/json",
            "Authorization: Token ". $token,
        ];

        $parameters = array(
            "placeid"=>$placeId,
            "useruuid"=>$userUuid
        );

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS,json_encode($parameters));
        curl_setopt($curl,CURLOPT_HTTPHEADER,$headers);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $response = json_decode(curl_exec($curl));
        curl_close($curl);
        return $response;
    }

    function getBmsDevice($devEui,$userUuid,$token){
        global $bmsURL;
        $url = "http://185.2.14.188/BuildingManagementSystem" . "/getBmsDevice";
        
        $headers = [
            "Content-Type: application/json",
            "Authorization: Token ". $token,
        ];

        $parameters = array(
            "deveui"=>$devEui,
            "useruuid"=>$userUuid
        );


        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS,json_encode($parameters));
        curl_setopt($curl,CURLOPT_HTTPHEADER,$headers);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $response = json_decode(curl_exec($curl));
        curl_close($curl);
        return $response;
    }

    function getBmsDevices($userUuid,$token){
        $url = "http://185.2.14.188/BuildingManagementSystem" . "/getBmsDevices";

        $headers = [
            "Content-Type: application/json",
            "Authorization: Token ". $token,
        ];
        
        $parameters = array(
            "useruuid"=>$userUuid
        );

        $curl = curl_init();

        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS,json_encode($parameters));
        curl_setopt($curl,CURLOPT_HTTPHEADER,$headers);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

        $response = json_decode(curl_exec($curl));

        curl_close($curl);
        return $response;
    }

    function getSubDevices($devEui,$userUuid,$token){
        $url = "http://185.2.14.188/BuildingManagementSystem" . "/getSubDevices";

        $headers = [
            "Content-Type: application/json",
            "Authorization: Token ". $token,
        ];

        $parameters = array(
            "deveui"=>$devEui,
            "useruuid"=>$userUuid
        );

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS,json_encode($parameters));
        curl_setopt($curl,CURLOPT_HTTPHEADER,$headers);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $response = json_decode(curl_exec($curl));
        curl_close($curl);
        return $response;
    }

    function getAllScenarios($useruuid,$token){
        global $mainURL;
        $url = $GLOBALS['mainURL'] . "/getAllScenarios";
        $headers = [
            "Content-Type: application/json",
            "Authorization: Token ". $token,
        ];

        $parameters = array(
            "useruuid"=>$useruuid
        );

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS,json_encode($parameters));
        curl_setopt($curl,CURLOPT_HTTPHEADER,$headers);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $response = json_decode(curl_exec($curl));
        curl_close($curl);
        return $response;
    }

    function getAllNotification($useruuid,$token){
        global $mainURL;
        $url = $GLOBALS['mainURL'] . "/getNotifications";
        $headers = [
            "Content-Type: application/json",
            "Authorization: Token ". $token,
        ];

        $parameters = array(
            "useruuid"=>$useruuid
        );
        
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS,json_encode($parameters));
        curl_setopt($curl,CURLOPT_HTTPHEADER,$headers);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $response = json_decode(curl_exec($curl));
        curl_close($curl);
        return $response;
    }

    function getQuickAccessDevices($useruuid,$token){
        global $mainURL;
        $url = $GLOBALS['mainURL'] . "/getAllQuickAccessDevices";
        $headers = [
            "Content-Type: application/json",
            "Authorization: Token ". $token,
        ];

        $parameters = array(
            "useruuid"=>$useruuid
        );
        
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS,json_encode($parameters));
        curl_setopt($curl,CURLOPT_HTTPHEADER,$headers);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $response = json_decode(curl_exec($curl));
        curl_close($curl);
        return $response;
    }

    function deleteDevice($deviceid,$useruuid,$token){
        global $mainURL;
        $url = $GLOBALS['mainURL'] . "/deleteDevice";
        $headers = [
            "Content-Type: application/json",
            "Authorization: Token ". $token,
        ];

        $parameters = array(
            "deviceid"=>$deviceid,
            "useruuid"=>$useruuid
        );

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS,json_encode($parameters));
        curl_setopt($curl,CURLOPT_HTTPHEADER,$headers);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $response = json_decode(curl_exec($curl));
        curl_close($curl);
        return $response;
    }
?>