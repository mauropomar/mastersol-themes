<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] . 'Class/Auditoria.php';
    $params['id_user'] = isset($_GET['usuario']) && $_GET['usuario'] != "" ? $_GET['usuario'] : null;
    $params['id_properties'] = isset($_GET['propiedad']) && $_GET['propiedad'] != "" ? $_GET['propiedad'] : null;
    $params['id_action'] = isset($_GET['accion']) && $_GET['accion'] != "" ? $_GET['accion'] : null;
    $params['idregister'] = isset($_GET['idregister']) && $_GET['idregister'] != "" ? $_GET['idregister'] : null;
    $params['idsection'] = isset($_GET['idsection']) && $_GET['idsection'] != "" ? $_GET['idsection'] : null;
    $params['datei'] = isset($_GET['desde']) && $_GET['desde'] != "" ? date_format(date_create_from_format('d/m/Y', $_GET['desde']), 'Y-m-d') : null;
    $params['datef'] = isset($_GET['hasta']) && $_GET['hasta'] != "" ? date_format(date_create_from_format('d/m/Y', $_GET['hasta']), 'Y-m-d') : null;

    $objAuditoria = new Auditoria();
    $result = $objAuditoria->getFilterAuditorias($params);
    echo !is_null($result) ? json_encode($result) : json_encode([]);
} else {
    header("Location: ../../index.php");
}
