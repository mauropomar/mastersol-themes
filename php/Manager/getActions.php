<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] . 'Class/Tables.php';
    $objUser = new Tables();
    $result = $objUser->getActions();
    echo !is_null($result) ? $result : json_encode([]);
} else {
    header("Location: ../../index.php");
}
