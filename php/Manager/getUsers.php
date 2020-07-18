<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] . 'Class/User.php';
    $params['id_organizations'] = isset($_SESSION['id_organizations']) ? $_SESSION['id_organizations'] : null;
    $objUser = new User();
    $result = $objUser->getUsers($params);
    echo !is_null($result) ? $result : json_encode([]);
} else {
    header("Location: ../../index.php");
}
