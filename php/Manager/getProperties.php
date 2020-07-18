<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] . 'Class/Tables.php';
    $params['idsection'] = isset($_GET['idsection']) ? $_GET['idsection'] : null;
    $objUser = new Tables();
    $result = $objUser->getTablesProperties($params);
    echo !is_null($result) ? $result : json_encode([]);
} else {
    header("Location: ../../index.php");
}
