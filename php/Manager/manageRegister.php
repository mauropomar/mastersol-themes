<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] . 'Class/Register.php';
    $params = [];
    $params['action'] = isset($_POST['accion']) ? $_POST['accion'] : null;
    $params['data'] = isset($_POST['data']) ? json_decode($_POST['data']) : null;
    $params['idsection'] = isset($_POST['idsection']) ? $_POST['idsection'] : null;
    $params['section_checked'] = isset($_POST['section_checked']) ? $_POST['section_checked'] : false;
    $params['idsectionpadre'] = isset($_POST['idseccionpadre']) && isset($_POST['idseccionpadre']) != 0 ? $_POST['idseccionpadre'] : null;

    if ($params['action'] != '7') {
        $params['idregistro'] = isset($_POST['idregistro']) && $_POST['idregistro'] != '' ? $_POST['idregistro'] : $_POST['idseccionpadre'];
    } else {
        $params['idregistro'] = isset($_POST['id']) ? json_decode($_POST['id']) : null;
    }

    $params['id_menu'] = isset($_POST['idmenu']) ? $_POST['idmenu'] : null;
    $params['id_capsules'] = isset($_SESSION['id_capsules']) ? $_SESSION['id_capsules'] : null;
    $params['id_organizations'] = isset($_SESSION['id_organizations']) ? $_SESSION['id_organizations'] : null;
    $params['id_user'] = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : null;
    $params['idpadreregistro'] = isset($_POST['idpadreregistro']) && ($_POST['idpadreregistro'] != 0 && !is_null($_POST['idpadreregistro'])) ? $_POST['idpadreregistro'] : null;
    $objRegister = new Register();

    if ($params['action'] == '13') {
        $result = $objRegister->insertRegister($params);
    } elseif ($params['action'] == '14') {
        $result = $objRegister->updateRegister($params);
    } elseif ($params['action'] == '7') {
        $result = $objRegister->deleteRegister($params);
    }
    echo json_encode($result);
} else {
    header("Location: ../../index.php");
}
