<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] .'Class/User.php';
    $objUser = new User();
    $params['id_capsules'] = $_SESSION['id_capsules'];
    $params['id_organizations'] = $_SESSION['id_organizations'];
    $params['id_user'] = $_SESSION['id_user'];
    $params['id_rol'] = $_POST['idrol'];
    $params['id_language'] = $_POST['idlanguajes'];
    $result = $objUser->managerUserOption($params);
    echo json_encode($result);
} else {
    header("Location: ../../index.php");
}