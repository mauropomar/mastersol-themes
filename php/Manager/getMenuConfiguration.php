<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] . 'Class/MenuConfiguration.php';
    $objMenu = new MenuConfiguration();
    $params['id_capsules'] = $_SESSION['id_capsules'];
    $params['id_organizations'] = $_SESSION['id_organizations'];
    $params['id_rol'] = $_SESSION['id_rol'];
    $params['idmenu'] = isset($_GET['node']) ? $_GET['node'] : null;//$_GET['level'];
    $result = $objMenu->getMenu($params);
    echo $result;
} else {
    header("Location: ../../index.php");
}
