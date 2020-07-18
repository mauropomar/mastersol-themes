<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] . 'Class/MenuOption.php';
    $objMenu = new MenuOption();
    $params['id_capsules'] = $_SESSION['id_capsules'];
    $params['id_organizations'] = $_SESSION['id_organizations'];
    $params['id_rol'] = $_SESSION['id_rol'];
    $params['idmenu'] = isset($_GET['idparent']) ? $_GET['idparent'] : null;
    $result = $objMenu->getMenu($params);
    echo $result;
} else {
    header("Location: ../../index.php");
}
