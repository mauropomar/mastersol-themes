<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] .'Repositories/RepositoryLanguage.php';
    $objMenu = new RepositoryLanguage();
    $result = $objMenu->getMenu();
    echo json_encode($result);
} else {
    header("Location: ../../index.php");
}