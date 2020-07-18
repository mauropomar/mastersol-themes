<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] .'Class/Rol.php';
    $params['start'] = $_GET['start'];
    $params['limit'] = $_GET['limit'];
    $params['idcapsules'] = $_SESSION['id_capsules'];
    $params['idorganizations'] = $_SESSION['id_organizations'];
    $objMenu = new Rol();
    $result = $objMenu->getRoles($params);
    echo $result;
} else {
    header("Location: ../../index.php");
}
