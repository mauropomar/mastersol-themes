<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] .'Class/Language.php';
    $params['start'] = $_GET['start'];
    $params['limit'] = $_GET['limit'];
    $params['idcapsules'] = $_SESSION['id_capsules'];
    $objMenu = new Language();
    $result = $objMenu->getLanguages($params);
    echo $result;
} else {
    header("Location: ../../index.php");
}
