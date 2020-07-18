<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] . 'Class/Filter.php';
    $params['idsection'] = $_POST['idsection'];
    $params['idrol'] = $_SESSION['id_rol'];
    $params['data'] = isset($_POST['data']) ? json_decode($_POST['data']) : null;
    $objFilter = new Filter();
    $result = $objFilter->getResultFiltersFunctions($params);
    echo json_encode($result);
} else {
    header("Location: ../../index.php");
}
