<?php
    include "./Functions.php";
    include "./vendors/pubVariable.php";
    $allScenarios = getAllScenarios($_SESSION['behamad_uuid'],$_SESSION['behamad_token']);

    $notifications = getAllNotification($_SESSION['behamad_uuid'],$_SESSION['behamad_token']) -> data;
    $lastNotifications = array_slice($notifications,1,3);
?>


<!DOCTYPE html>
<html dir="rtl" lang="fa">
    <head>
        <meta charset="utf-8">
        <title>سناریو های خانه هوشمند - سیستم مدیریت ساختمان بهامد</title>
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
                    <a href="/dashboard/devices" class="nav-item nav-link"><i class="fas fa-home me-2"></i>خانه هوشمند</a>
                    <a href="/dashboard/bms" class="nav-item nav-link"><i class="fa fa-building me-2"></i>ساختمان هوشمند</a>
                    <a href="/dashboard/charts" class="nav-item nav-link active"><i class="fa fa-clock me-2"></i>سناریو ها</a>
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
                <div class="row bg-dark rounded align-items-start justify-content-start" id="buildingList">
                    <?php
                        foreach($allScenarios -> data as $scenario):
                    ?>
                        <button class="bg-secondary d-flex align-items-center border-bottom py-3 section-card" onclick="showModal('<?= $scenario->name ?>','<?= $scenario -> sourcedevice -> name ?>','<?= $scenario->destinationdevice->name ?>',<?= $scenario -> status ?>)">
                            <div class="w-100 ms-3">
                                <div class="d-flex w-100 justify-content-between">
                                    <h6 class="mb-0 scenario-name"><?= substr($scenario->name,0,strpos($scenario->name,"-")) ?></h6>
                                </div>
                                <P style="color:white;text-align:right"><?= substr($scenario -> name,strpos($scenario->name,"-")+1,strlen($scenario -> name)-1) ?></P>
                            </div>
                        </button>
                        <div id="scenarioContent" class="modal">
                            <div class="modal-content">
                                <span id="scenarioClose" class="close">&times;</span>
                                <p id="scenarioName"></p>
                                <div class="modal-item">
                                    <span><p>دستگاه مبدا: </p></span><span><p id="scenarioSourceDevice"></p></span>
                                </div>
                                <div class="modal-item">
                                    <span><p>دستگاه مقصد: </p></span><span><p id="scenarioDestinationDevice"></p></span>
                                </div>
                                <div class="modal-item">
                                    <span><p>وضعیت: </p></span><span><p id="scenarioStatus"></p></span>
                                </div>
                                <button class="btn btn-block btn-info">حذف سناریو</button>
                            </div>
                        </div>
                    <?php endforeach ?>
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
    <script src="/js/main.js"></script>
    <script src="/js/modal.js"></script>
</body>
</html>