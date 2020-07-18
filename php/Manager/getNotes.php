<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] . 'Class/Notas.php';
    $params['id_section'] = $_GET['idsection'];
    $params['id_register'] = isset($_GET['idregistro']) ? $_GET['idregistro'] : null;
    //$params['id_register'] = '5e07a27b-7b04-4b8e-9227-14f1682b33d2';
    $objNota = new Notas();
    $reult = $objNota->getNotes($params);
    echo $reult;
} else {
    header("Location: ../../index.php");
}