<?php
    include "./Functions.php";
    include "./vendors/pubvariable.php";
    $url = parse_url($_SERVER['REQUEST_URI']);
    //var_dump($url);
    $path = explode("/",$url['path']);
    //var_dump($path);
    $devEui = end($path);
    //var_dump($devEui);

    $relay1Ok = false;
    $relay1Fport = "";
    $relay1Channel = "";

    $relay2Ok = false;
    $relay2Fport = "";
    $relay2Channel = "";

    $relay3Ok = false;
    $relay3Fport = "";
    $relay3Channel = "";

    $relay4Ok = false;
    $relay4Fport = "";
    $relay4Channel = "";

    $servoOk = false;
    $servoFport = "";
    $servoChannel="";

    $dhtOk = false;
    $dhtChannel = "";
    $dhtFport = "";

    $rs485Ok = false;
    $rs485Fport = "";
    $rs485Channel = "";

    $deviceData = getBmsDevice($devEui,$_SESSION['behamad_uuid'],$_SESSION['behamad_token']);
    if($deviceData -> status){
        $device = $deviceData -> data;
        $subDevices = getSubDevices($devEui,$_SESSION['behamad_uuid'],$_SESSION['behamad_token']) -> data;

        $downTopic = "application/" . $device->appId . "/" . "device/" . $device -> devEui . "/" . "command/down";

        $ackTopic = "application/" . $device->appId . "/" . "device/" . $device -> devEui . "/" . "event/up";

        for($index=0;$index<count($subDevices);$index++){
            if($subDevices[$index]->subDeviceName == "RELAY1"){
                $relay1Fport = $subDevices[$index] -> subDeviceFport;
                $relay1Channel = $subDevices[$index] -> subDeviceChannel;
                $relay1Ok = true;
            }

            if($subDevices[$index]->subDeviceName == "RELAY2"){
                $relay2Fport = $subDevices[$index] -> subDeviceFport;
                $relay2Channel = $subDevices[$index] -> subDeviceChannel;
                $relay2Ok = true;
            }

            if($subDevices[$index]->subDeviceName == "RELAY3"){
                $relay3Fport = $subDevices[$index] -> subDeviceFport;
                $relay3Channel = $subDevices[$index] -> subDeviceChannel;
                $relay3Ok = true;
            }

            if($subDevices[$index]->subDeviceName == "RELAY4"){
                $relay4Fport = $subDevices[$index] -> subDeviceFport;
                $relay4Channel = $subDevices[$index] -> subDeviceChannel;
                $relay4Ok = true;
            }

            if($subDevices[$index]->subDeviceName == "SERVO"){
                $servoFport = $subDevices[$index] -> subDeviceFport;
                $servoChannel = $subDevices[$index] -> subDeviceChannel;
                $servoOk = true;
            }

            if($subDevices[$index]->subDeviceName == "DHT22"){
                $dhtFport = $subDevices[$index] -> subDeviceFport;
                $dhtChannel = $subDevices[$index] -> subDeviceChannel;
                $dhtOk = true;
            }

            if($subDevices[$index] -> subDeviceName == "RS485"){
                $rs485Fport = $subDevices[$index] -> subDeviceFport;
                $rs485Channel = $subDevices[$index] -> subDeviceChannel;
                $rs485Ok = true;
            }
        }
    }

    $notifications = getAllNotification($_SESSION['behamad_uuid'],$_SESSION['behamad_token']) -> data;

    $lastNotifications = array_slice($notifications,1,3);

?>
<!DOCTYPE html>
<html dir="rtl" lang="fa">
    <head>
        <meta charset="utf-8">
        <title>سیستم مدیریت ساختمان هوشمند بهامد</title>
        <meta content="width=device-width, initial-scale=1.0" name="viewport">
        <meta content="" name="keywords">
        <meta content="" name="description">
        <link href="img/favicon.ico" rel="icon">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Roboto:wght@500;700&display=swap" rel="stylesheet"> 
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet">
        <link href="/lib/owlcarousel/assets/owl.carousel.min.css" rel="stylesheet">
        <link href="/lib/tempusdominus/css/tempusdominus-bootstrap-4.min.css" rel="stylesheet" />
        <link href="/css/bootstrap.min.css" rel="stylesheet">
        <link href="/css/style.css" rel="stylesheet">
        <link href="/css/toggle.css" rel="stylesheet">
    </head>
<body>
    <div class="container-fluid position-relative d-flex p-0">
        <!-- Spinner Start -->
        <div id="spinner" class="show bg-dark position-fixed translate-middle w-100 vh-100 top-50 start-50 d-flex align-items-center justify-content-center">
            <div class="spinner-border text-info" style="width: 3rem; height: 3rem;" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        <!-- Spinner End -->


        <!-- Sidebar Start -->
        <div class="sidebar pe-4 pb-3">
            <nav class="navbar bg-secondary navbar-dark">
                <a href="index.html" class="navbar-brand mx-4 mb-3">
                    <img src="/img/behamad-logo.png" class="main-logo" style="width: 120px; height: 70px;" alt="">
                </a>
                <div class="d-flex align-items-center ms-4 mb-4">
                    <div class="position-relative">
                        <img class="rounded-circle" src="/img/user.jpg" alt="" style="width: 40px; height: 40px;">
                        <div class="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1"></div>
                    </div>
                    <div class="ms-3">
                        <h6 class="mb-0"><?= $_SESSION['behamad_name'] ?></h6>
                        <span><?= $_SESSION['behamad_username'] ?></span>
                    </div>
                </div>
                <div class="navbar-nav w-100">
                    <a href="/dashboard" class="nav-item nav-link"><i class="fa fa-tachometer-alt me-2"></i>داشبورد</a>
                    <a href="/dashboard/devices" class="nav-item nav-link"><i class="fas fa-home me-2"></i>خانه هوشمند</a>
                    <a href="/dashboard/bms" class="nav-item nav-link active"><i class="fa fa-building me-2"></i>ساختمان هوشمند</a>
                    <a href="/dashboard/charts" class="nav-item nav-link"><i class="fa fa-clock me-2"></i>سناریو ها</a>
                </div>
            </nav>
        </div>

        <div class="content">
            <!-- Navbar Start -->
            <nav dir="ltr" class="navbar navbar-expand bg-secondary navbar-dark sticky-top px-4 py-0">
                <a href="#" class="sidebar-toggler flex-shrink-0">
                    <i class="fa fa-bars"></i>
                </a>
                <div class="navbar-nav align-items-center ms-auto">
                    <div class="nav-item dropdown">
                        <a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                            <i class="fa fa-bell me-lg-2"></i>
                            <span class="d-none d-lg-inline-flex">اطلاعیه</span>
                        </a>
                        <div class="dropdown-menu dropdown-menu-end bg-secondary border-0 rounded-0 rounded-bottom m-0">
                            <?php foreach($lastNotifications as $notfication): ?>
                                <a href="#" class="dropdown-item">
                                    <h6 class="fw-normal mb-0"><?= $notfication -> subject ?></h6>
                                </a>
                                <hr class="dropdown-divider">
                            <?php endforeach ?>
                            <hr class="dropdown-divider">
                            <a href="#" class="dropdown-item text-center">دیدن همه اطلاعیه ها</a>
                        </div>
                    </div>
                </div>
            </nav>
            <!-- Navbar End -->
             
            <div class="container pt-4 px-4">
                <div class="row bg-dark rounded align-items-start justify-content-start">
                    <div class="col-sm-12 col-xl-12 section">
                        <div class="bg-secondary rounded d-flex align-items-center justify-content-evenly p-4">
                            <img class="device-icon-action" src="/img/modem.png" alt="">
                            <div class="ms-3">
                                <input type="hidden" id="appId" value=<?= $device -> appId ?> hidden>
                                <input type="hidden" id="downTopic" value=<?= $downTopic ?> hidden>
                                <input type="hidden" id="ackTopic" value=<?= $ackTopic ?> hidden>
                                <input type="hidden" id="devEui" value=<?= $devEui ?> hidden>
                                <input type="hidden" id="relay1Ok" value=<?= $relay1Ok ?> hidden>
                                <input type="hidden" id="relay2Ok" value=<?= $relay2Ok ?> hidden>
                                <input type="hidden" id="relay3Ok" value=<?= $relay3Ok ?> hidden>
                                <input type="hidden" id="relay4Ok" value=<?= $relay3Ok ?> hidden>
                                <input type="hidden" id="servoOk" value=<?= $servoOk ?> hidden>
                                <input type="hidden" id="dhtOk" value=<?= $dhtOk ?> hidden>
                                <h6 class="mb-0"><?= $device -> devname ?></h6>
                            </div>
                        </div>
                    </div>
                    <?php if($relay1Ok): ?>
                        <input type="hidden" id="relay1Fport" value=<?= $relay1Fport ?> hidden>
                        <input type="hidden" id="relay1Channel" value=<?= $relay1Channel ?> hidden>
                        <div class="col-sm-6 col-xl-6 section">
                            <div dir="ltr" class="col-sm-12 col-xl-12 section">
                                <div class="bg-secondary rounded d-flex align-items-center justify-content-evenly p-4">
                                    <p>بسته</p>
                                    <label class="switch-wrap">
                                        <input type="checkbox" id="relay1Switch"/>
                                        <div class="switch"></div>
                                    </label>
                                    <p>باز</p>
                                </div>
                            </div>
                        </div>
                    <?php else: ?>
                    <?php endif ?>

                    <?php if($relay2Ok): ?>
                        <input type="hidden" id="relay2Fport" value=<?= $relay2Fport ?> hidden>
                        <input type="hidden" id="relay2Channel" value=<?= $relay2Channel ?> hidden>
                        <div class="col-sm-6 col-xl-6 section">
                            <div dir="ltr" class="col-sm-12 col-xl-12 section">
                                <div class="bg-secondary rounded d-flex align-items-center justify-content-evenly p-4">
                                    <p>بسته</p>
                                    <label class="switch-wrap">
                                        <input type="checkbox" id="relay2Switch"/>
                                        <div class="switch"></div>
                                    </label>
                                    <p>باز</p>
                                </div>
                            </div>
                        </div>
                    <?php else: ?>
                    <?php endif ?>

                    <?php if($relay3Ok): ?>
                        <input type="hidden" id="relay3Fport" value=<?= $relay3Fport ?> hidden>
                        <input type="hidden" id="relay3Channel" value=<?= $relay3Channel ?> hidden>
                        <div class="col-sm-6 col-xl-6 section">
                            <div dir="ltr" class="col-sm-12 col-xl-12 section">
                                <div class="bg-secondary rounded d-flex align-items-center justify-content-evenly p-4">
                                    <p>بسته</p>
                                    <label class="switch-wrap">
                                        <input type="checkbox" id="relay3Switch"/>
                                        <div class="switch"></div>
                                    </label>
                                    <p>باز</p>
                                </div>
                            </div>
                        </div>
                    <?php else: ?>
                    <?php endif ?>

                    <?php if($relay4Ok): ?>
                        <input type="hidden" id="relay4Fport" value=<?= $relay4Fport ?> hidden>
                        <input type="hidden" id="relay4Channel" value=<?= $relay4Channel ?> hidden>
                        <div class="col-sm-6 col-xl-6 section">
                            <div dir="ltr" class="col-sm-12 col-xl-12 section">
                                <div class="bg-secondary rounded d-flex align-items-center justify-content-evenly p-4">
                                    <p>بسته</p>
                                    <label class="switch-wrap">
                                        <input type="checkbox" id="relay4Switch"/>
                                        <div class="switch"></div>
                                    </label>
                                    <p>باز</p>
                                </div>
                            </div>
                        </div>
                    <?php else: ?>
                    <?php endif ?>

                    <?php if($servoOk): ?>
                        <input type="hidden" id="servoFport" value=<?= $servoFport ?> hidden>
                        <input type="hidden" id="servoChannel" value=<?= $servoChannel ?> hidden>
                        <div dir="ltr" class="col-sm-12 col-xl-12 section">
                            <div class="bg-secondary rounded d-flex align-items-center justify-content-evenly p-4">
                                <p>بسته</p>
                                <label class="switch-wrap">
                                    <input type="checkbox" id="servoSwitch"/>
                                    <div class="switch"></div>
                                </label>
                                <p>باز</p>
                            </div>
                        </div>
                    <?php else: ?>
                    <?php endif ?>

                    <?php if($dhtOk): ?>
                        <input type="hidden" id="dhtFport" value=<?= $dhtFport ?> hidden>
                        <input type="hidden" id="dhtChannel" value=<?= $dhtChannel ?> hidden>
                        <div class="col-sm-6 col-xl-6 section">
                            <div class="progress-percentage bg-secondary rounded d-flex align-items-center justify-content-around p-4">
                                <div class="progress-percentage">
                                    <div id="temperatureCirProg"></div>
                                </div>    
                            </div>
                        </div>
                        <div class="col-sm-6 col-xl-6 section">
                            <div class="progress-percentage bg-secondary rounded d-flex align-items-center justify-content-around p-4">
                                <div class="progress-percentage">
                                    <div id="humidityCirProg"></div>
                                </div>    
                            </div>
                        </div>
                    <?php else: ?>
                    <?php endif ?>

                    <?php if($rs485Ok): ?>
                        <input type="hidden" id="rs485Fport" value=<?= $rs485Fport ?> hidden>
                        <input type="hidden" id="rs485Channel" value=<?= $rs485Channel ?> hidden>
                        <div class="col-sm-12 col-xl-12 section">
                            <div class="bg-secondary rounded d-flex align-items-center justify-content-around p-4">
                                <div class="row slidecontainer">
                                    <div class="col-sm-6">
                                        <p>میزان مصرف</p>
                                    </div>
                                    <div class="col-sm-6">
                                        <p>
                                            
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <?php else: ?>
                    <?php endif ?>

                </div>
            </div>
        </div>
        <!-- Sidebar End -->



        <!-- Back to Top -->
        <a href="#" class="btn btn-lg btn-info btn-lg-square back-to-top"><i class="bi bi-arrow-up"></i></a>
    </div>
    <script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.min.js" type="text/javascript"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/easy-pie-chart/2.1.6/jquery.easypiechart.min.js"></script>
    <script src="/lib/chart/chart.min.js"></script>
    <script src="/lib/easing/easing.min.js"></script>
    <script src="/lib/waypoints/waypoints.min.js"></script>
    <script src="/lib/owlcarousel/owl.carousel.min.js"></script>
    <script src="/lib/tempusdominus/js/moment.min.js"></script>
    <script src="/lib/tempusdominus/js/moment-timezone.min.js"></script>
    <script src="/lib/tempusdominus/js/tempusdominus-bootstrap-4.min.js"></script>
    <script src="/js/circle-progress.min.js"></script>
    <script src="/js/circle-range.js"></script>
    <script src="/js/circle-progress.min.js"></script>
    <script src="/js/circle-range.js"></script>
    <script src="/js/main.js"></script>
    <script src="/js/bmsDevices.js"></script>   
</body>
</html>