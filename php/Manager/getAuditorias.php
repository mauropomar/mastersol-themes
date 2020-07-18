<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] . 'Class/Auditoria.php';
    $params['id_section'] = isset($_GET['idsection']) ? $_GET['idsection'] : null;
    $params['id_register'] = isset($_GET['idregister']) ? $_GET['idregister'] : null;
    $params['id_user'] = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : null;
    $objAuditoria = new Auditoria();
    $result = $objAuditoria->getAuditorias($params);
    echo !is_null($result['datos']) ? json_encode($result) : json_encode([]);
} else {
    header("Location: ../../index.php");
}
