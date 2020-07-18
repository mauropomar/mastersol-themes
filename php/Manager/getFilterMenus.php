<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] . 'Class/MenuOption.php';
    $obj = new MenuOption();
    $params['value_filter'] = $_GET['query'];
    $result = $obj->getFilterMenu($params);
    echo $result;
} else {
    header("Location: ../../index.php");
}