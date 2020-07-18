<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] . 'Class/Shortcut.php';
    $params['id_register'] = isset($_POST['id']) ? "{" . $_POST['id'] . "}" : null;
    $params['id_user'] = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : null;
    $params['idsection'] = null;
    $objShortcut = new Shortcut();
    $result = [];
    if (isset($_POST['accion']) && !is_null($_POST['accion']) && $_POST['accion'] = '10') {
        $result = $objShortcut->deleteShortcut($params);
    }

    echo json_encode($result);
} else {
    header("Location: ../../index.php");
}
