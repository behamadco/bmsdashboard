<?php
    include "./Functions.php";
    include "./vendors/pubvariable.php";
    $url = parse_url($_SERVER['REQUEST_URI']);
    $path = explode("/",$url['path']);
    $deviceId = end($path);

    $getDeviceData = getDevice($deviceId,$_SESSION['behamad_uuid'],$_SESSION['behamad_token']);
    $device = $getDeviceData -> data;
    if($getDeviceData -> message != "Success"){
        header ('Location: /dashboard');
    }
    $building = getBuilding($device  -> buildingid,$_SESSION['behamad_uuid'],$_SESSION['behamad_token']) -> data;
    $place = getPlace($device  -> placeid,$_SESSION['behamad_uuid'],$_SESSION['behamad_token']) -> data;


    $topic = $_SESSION['behamad_uuid'] . "/" . $building -> subtopic . "/" . $place -> subtopic . "/" . $device -> subtopic;
    $statusTopic = $topic . "/" . "status";

    $notifications = getAllNotification($_SESSION['behamad_uuid'],$_SESSION['behamad_token']) -> data;
    $lastNotifications = array_slice($notifications,1,3);

?>
<!DOCTYPE html>
<html dir="rtl" lang="fa">
    <head>
        <meta charset="utf-8">
        <title><?= $device -> name ?> - سیستم مدیریت ساختمان هوشمند بهامد</title>
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
                    <a href="/dashboard/devices" class="nav-item nav-link active"><i class="fas fa-home me-2"></i>خانه هوشمند</a>
                    <a href="/dashboard/bms" class="nav-item nav-link"><i class="fa fa-building me-2"></i>ساختمان هوشمند</a>
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
                            <img class="device-icon-action" src="<?= $deviceIcon[$device -> type] ?>" alt="">
                            <div class="ms-3">
                                <input type="text" id="deviceType" value=<?= $device -> type ?> hidden>
                                <input type="number" id="deviceId" value=<?= $device -> id ?> hidden>
                                <input type="hidden" id="topic" value=<?= $topic ?> hidden>
                                <input type="hidden" id="statusTopic" value=<?= $statusTopic ?> hidden>
                                <input type="hidden" id="token" value=<?= $_SESSION['behamad_token'] ?> hidden>
                                <p class="mb-2"><?= $devicePublicName[$device -> type] ?></p>
                                <h6 class="mb-0"><?= $device -> name ?></h6>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-xl-12 section">
                        <div class="bg-secondary rounded d-flex align-items-center justify-content-start p-4">
                            <span><h6>وضعیت اتصال: </h6></span>
                            <span><h6 class='not-connected' id="connectStatus">در حال اتصال</h6></span>
                        </div>
                        <div class="bg-secondary rounded d-flex align-items-center justify-content-start p-4">
                            <span><h6>نسخه: </h6></span>
                            <span class="version-content"><h6 id="version">در حال دریافت</h6></span>
                            <span class="update" id="update"><h6>به روز رسانی در دسترس است</h6></span>
                        </div>
                    </div>
                    <?php if($device -> type == "BUZZER"): ?>
                        <div dir="ltr" class="col-sm-12 col-xl-12 section">
                            <div class="bg-secondary rounded d-flex align-items-center justify-content-evenly p-4">
                                <p>خاموش</p>
                                <div class="onoffswitch">
                                    <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="buzzerOnOff" tabindex="0" checked>
                                    <label class="onoffswitch-label" for="myonoffswitch">
                                        <span class="onoffswitch-inner"></span>
                                        <span class="onoffswitch-switch"></span>
                                    </label>
                                </div>
                                <p>روشن</p>
                            </div>
                        </div>
                    <?php elseif($device -> type == "COOLER_KEY"): ?>
                        <div class="col-sm-12 col-xl-12 section">
                            <div class="bg-secondary rounded d-flex align-items-center justify-content-around p-4">
                                    <i class="fa fa-water" val="0" id="pomp"></i>
                                    <i class="fa fa-fan" val="0" id="slow"></i>
                                    <i class="fa fa-wind" val="0" id="fast"></i>
                            </div>
                        </div>
                    <?php elseif($device -> type == "FLOWERPOT"): ?>
                        <div class="col-sm-12 col-xl-12 section">
                            <div class="progress-percentage bg-secondary rounded d-flex align-items-center justify-content-around p-4">
                                <div class="progress-percentage">
                                    <div id="potCirProg"></div>
                                </div>    
                            </div>
                        </div>
                    <?php elseif($device -> type == "THERMOSTAT"): ?>
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
                    <?php elseif($device -> type == "LOCK"): ?>
                        <div class="col-sm-12 col-xl-12 section">
                            <div class="bg-secondary rounded d-flex align-items-center justify-content-around p-4">
                                    <button class="btn btn-danger btn-block" id="openLock"><i class="fa fa-lock fa-3x"></i></button>
                            </div>
                        </div>
                    <?php elseif($device -> type == "MOTIONDETECTOR"): ?>
                        <div class="col-sm-12 col-xl-12 section">
                            <div class="bg-secondary rounded d-flex align-items-center justify-content-around p-4">
                                <p id="motion">بدون تردد</p>
                            </div>
                        </div>
                    <?php elseif($device -> type == "SOCKET"): ?>
                        <div class="col-sm-12 col-xl-12 section">
                            <div class="bg-secondary rounded d-flex align-items-center justify-content-around p-4">
                                    <i class="fa fa-power-off" val="0" id="socket"></i>
                            </div>
                        </div>
                    <?php elseif($device -> type == "TOUCHKEY"): ?>
                        <div class="col-sm-12 col-xl-12 section">
                            <div class="bg-secondary rounded d-flex align-items-center justify-content-around p-4">
                                    <i class="fa fa-power-off" val="0" id="bridge1"></i>
                            </div>
                        </div>
                    <?php elseif($device -> type == "TOUCHKEY_2B"): ?>
                        <div class="col-sm-12 col-xl-12 section">
                            <div class="bg-secondary rounded d-flex align-items-center justify-content-around p-4">
                                    <i class="fa fa-power-off" val="0" id="bridge1"></i>
                                    <i class="fa fa-power-off" val="0" id="bridge2"></i>
                            </div>
                        </div>
                    <?php elseif($device -> type == "TOUCHKEY_3B"): ?>
                        <div class="col-sm-12 col-xl-12 section">
                            <div class="bg-secondary rounded d-flex align-items-center justify-content-around p-4">
                                    <i class="fa fa-power-off" val="0" id="bridge1"></i>
                                    <i class="fa fa-power-off" val="0" id="bridge2"></i>
                                    <i class="fa fa-power-off" val="0" id="bridge3"></i>
                            </div>
                        </div>
                    <?php elseif($device -> type == "TOUCHKEY_4B"): ?>
                        <div class="col-sm-12 col-xl-12 section">
                            <div class="bg-secondary rounded d-flex align-items-center justify-content-around p-4">
                                    <i class="fa fa-power-off" val="0" id="bridge1"></i>
                                    <i class="fa fa-power-off" val="0" id="bridge2"></i>
                                    <i class="fa fa-power-off" val="0" id="bridge3"></i>
                                    <i class="fa fa-power-off" val="0" id="bridge4"></i>
                            </div>
                        </div>
                    <?php elseif($device -> type == "TOUCHKEY_16B"): ?>
                        <div class="col-sm-12 col-xl-12 section">
                            <div class="bg-secondary rounded d-flex align-items-center justify-content-around p-4">
                                    <i class="fa fa-power-off touchkey16" val="0"></i>
                                    <i class="fa fa-power-off touchkey16" val="0"></i>
                                    <i class="fa fa-power-off touchkey16" val="0"></i>
                                    <i class="fa fa-power-off touchkey16" val="0"></i>
                            </div>
                            <div class="bg-secondary rounded d-flex align-items-center justify-content-around p-4">
                                    <i class="fa fa-power-off touchkey16" val="0"></i>
                                    <i class="fa fa-power-off touchkey16" val="0"></i>
                                    <i class="fa fa-power-off touchkey16" val="0"></i>
                                    <i class="fa fa-power-off touchkey16" val="0"></i>
                            </div>
                            <div class="bg-secondary rounded d-flex align-items-center justify-content-around p-4">
                                    <i class="fa fa-power-off touchkey16" val="0"></i>
                                    <i class="fa fa-power-off touchkey16" val="0"></i>
                                    <i class="fa fa-power-off touchkey16" val="0"></i>
                                    <i class="fa fa-power-off touchkey16" val="0"></i>
                            </div>
                            <div class="bg-secondary rounded d-flex align-items-center justify-content-around p-4">
                                    <i class="fa fa-power-off touchkey16" val="0"></i>
                                    <i class="fa fa-power-off touchkey16" val="0"></i>
                                    <i class="fa fa-power-off touchkey16" val="0"></i>
                                    <i class="fa fa-power-off touchkey16" val="0"></i>
                            </div>
                        </div>
                    <?php elseif($device -> type == "CURTAIN"): ?>
                        <div class="col-sm-12 col-xl-12 section">
                            <div class="bg-secondary rounded d-flex align-items-center justify-content-around p-4">
                                <div dir="ltr" class="slidecontainer">
                                    <input type="range" min="1" max="98" value="1" class="slider" id="curtainRange">
                                    <p class="curtain-value" id="curtainValue"></p>
                                </div>
                            </div>
                        </div>
                    <?php elseif($device -> type == "VALVE"): ?>
                        <div dir="ltr" class="col-sm-12 col-xl-12 section">
                            <div class="bg-secondary rounded d-flex align-items-center justify-content-evenly p-4">
                                <p>بسته</p>
                                <div class="onoffswitch">
                                    <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="valveOnOff" tabindex="0" checked>
                                    <label class="onoffswitch-label" for="myonoffswitch">
                                        <span class="onoffswitch-inner"></span>
                                        <span class="onoffswitch-switch"></span>
                                    </label>
                                </div>
                                <p>باز</p>
                            </div>
                        </div>
                    <?php elseif($device -> type == "DIMMER"): ?>
                        <div dir="ltr" class="col-sm-12 col-xl-12 section">
                            <div class="bg-secondary rounded d-flex align-items-center justify-content-evenly p-4">
                                <div id="cirRange"></div>
                            </div>
                            <div class="bg-secondary rounded d-flex align-items-center justify-content-evenly p-4">
                                <p>خاموش</p>
                                <div class="onoffswitch">
                                    <label for="valveOnOff" style="display:none;"></label>
                                    <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="valveOnOff" placeholder="l" tabindex="0" checked>
                                    <label class="onoffswitch-label" for="myonoffswitch">
                                        <span class="onoffswitch-inner"></span>
                                        <span class="onoffswitch-switch"></span>
                                    </label>
                                </div>
                                <p>روشن</p>
                            </div>
                        </div>
                    <?php elseif($device -> type == "SENSOR"): ?>
                        <div dir="ltr" class="col-sm-12 col-xl-12 section">
                            <div class="bg-secondary rounded d-flex align-items-center justify-content-center p-4">
                                <div class="d-block w-100">
                                    <div class="progress">
                                        <div class="progress-bar bg-info" role="progressbar" style="width: 0%" id="mq2Progress" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-secondary rounded d-flex align-items-center justify-content-center p-4">
                                <p id="mq2Status"></p>
                            </div>
                        </div>
                    <?php elseif($device -> type == "HEIGHTDETECTOR"): ?>
                        <div class="col-sm-12 col-xl-12 section">
                            <div class="bg-secondary rounded d-flex align-items-center justify-content-center p-4">
                                <span><p id="height">0</p></span>
                                <span><p>متر</p></span>
                            </div>
                        </div>
                    <?php elseif($device -> type == "WINDOW_DOORSENSOR"): ?>
                        <div class="col-sm-12 col-xl-12 section">
                            <div class="bg-secondary rounded d-flex align-items-center justify-content-center p-4">
                                <span><p id="windowStatus"></p></span>
                            </div>
                        </div>
                    <?php endif ?>
                </div>
                <div class="row section">
                    <div class="col-sm-12 col-xl-12">
                        <div class="bg-secondary rounded d-flex align-items-center justify-content-between p-4">
                            <button id="deleteDevice" class="btn btn-info btn-block">حذف دستگاه</button>
                            <button id="modifyDevice" class="btn btn-info btn-block">تغییر نام دستگاه</button>
                            <button id="updateSketch" class="btn btn-info btn-block">بروز‌رسانی سخت افزار</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="deleteModal" class="modal">
            <div class="modal-content">
                <span id="deleteModalClose" class="close">&times;</span>
                <p style="text-align:center;">آیا از حذف دستگاه مطمیئن هستید؟</p>
                <div class="deleteButtons">
                    <button id="submitDeleteButton" class="btn btn-danger btn-block" onclick="deleteDevice('<?= $device -> id ?>','<?= $_SESSION['behamad_uuid'] ?>','<?= $_SESSION['behamad_token'] ?>')">حذف <span class="loading"></span></button>
                    <button id="cancelDeleteButton" class="btn btn-info btn-block">لغو</button>
                </div>
            </div>
        </div>
        <div id="deleteModal" class="modal">
            <div class="modal-content">
                <span id="deleteModalClose" class="close">&times;</span>
                <p style="text-align:center;">نام جدید دستگاه را وارد نمایید</p>
                <div class="newNameInput"></div>
                    <div class="form-family">
                        in
                    </div>
                <div class="deleteButtons">
                    <button id="submitDeleteButton" class="btn btn-danger btn-block" onclick="deleteDevice('<?= $device -> id ?>','<?= $_SESSION['behamad_uuid'] ?>','<?= $_SESSION['behamad_token'] ?>')">اعمال <span class="loading"></span></button>
                    <button id="cancelDeleteButton" class="btn btn-info btn-block">لغو</button>
                </div>
            </div>
        </div>
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
    <script src="/js/main.js"></script>
    <script src="/js/devices.js"></script>   
    <script src="/js/deviceOptions.js"></script>
</body>
</html>