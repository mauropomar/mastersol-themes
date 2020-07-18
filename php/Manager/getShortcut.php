<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] . 'Class/Shortcut.php';
    require_once $_SESSION['dir_folder_php'] . 'Repositories/RepositorySections.php';
    $objShort = new Shortcut();
    $result = $objShort->getShortcut();
    echo $result;
} else {
    header("Location: ../../index.php");
}
