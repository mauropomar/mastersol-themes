<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] . 'Class/Adjuntos.php';
    $params['id_user'] = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : null;
    $params['id_register'] = isset($_GET['idregister']) && $_GET['idregister'] != "" ? $_GET['idregister'] : null;
    $params['id_section'] = isset($_GET['idsection']) && $_GET['idsection'] != "" ? $_GET['idsection'] : null;
    $objAdjunto = new Adjuntos();
    $result = $objAdjunto->getAdjuntos($params);
    echo !is_null($result) ? json_encode($result) : json_encode([]);
} else {
    header("Location: ../../index.php");
}
