<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] . 'Class/Register.php';
    $params['idsection'] = isset($_GET['idsection']) ? $_GET['idsection'] : null;
    $params['idregistro'] = isset($_GET['idregistro']) ? $_GET['idregistro'] : null;
    $params['id_rol'] = $_SESSION['id_rol'];
    $objProduct = new Register();
    $result = $objProduct->getValuesForeignKey($params);
    echo !is_null($result) ? $result : json_encode([]);
} else {
    header("Location: ../../index.php");
}
