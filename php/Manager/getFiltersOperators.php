<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] . 'Class/Filter.php';
    $params['idsection'] = $_GET['idsection'];
    $objFilter = new Filter();
    $result = $objFilter->getFiltersOperators($params);
    echo $result;
} else {
    header("Location: ../../index.php");
}
