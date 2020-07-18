<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] . 'Class/Sections.php';
    $params['idsection'] = isset($_POST['sectionId']) && $_POST['sectionId'] != '' ? $_POST['sectionId'] : null;
    $params['id_rol'] = isset($_SESSION['id_rol']) && $_SESSION['id_rol'] != '' ? $_SESSION['id_rol'] : null;
    $params['start'] = isset($_POST['start']) && $_POST['start'] != '' ? $_POST['start'] : 0;
    $params['limit'] = isset($_POST['limit']) && $_POST['limit'] != '' ? $_POST['limit'] : 200;
    $objSection = new Sections();
    $result = $objSection->getSections($params);
    echo json_encode($result);
} else {
    header("Location: ../../index.php");
}
