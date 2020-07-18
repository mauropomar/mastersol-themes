<?php
session_start();
if (isset($_SESSION['user'])) {
    echo json_encode(['success' => true]);
} else {
    require_once 'class/User.php';
    $params[':user'] = $_POST['user'];
    $params[':passw'] = $_POST['password'];
    $objUser = new User();
    $result = $objUser->funcValidatingLogin($params);
    if (is_array($result) && count($result) > 0 && !is_null($result)) {
        $_SESSION['user'] = $_POST['user'];
        $_SESSION['id_capsules'] = $result['id_capsules'];
        $_SESSION['id_organizations'] = $result['id_organizations'];
        $_SESSION['id_rol'] = 'c2e9de83-6de6-4fe9-b933-3f4b4ec9c359';
        $_SESSION['id_user'] = $result['id_user'];
        $_SESSION['dir_folder_php'] = $_SERVER['DOCUMENT_ROOT'] . '/MasterSol/php/';
        require_once $_SESSION['dir_folder_php'] . 'Repositories/RepositorySections.php';
        $objRepSec = new RepositorySections();
        $objRepSec->createFolderCapsulesMultiple();
        $objRepSec->deleteFunctionBySection();
        echo json_encode(['success' => true, 'user' => $result['id_user']]);
    } else {
        echo json_encode(['success' => false]);
    }
}
