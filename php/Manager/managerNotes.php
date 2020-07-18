<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] . 'Class/Notas.php';
    $params['id_section'] = isset($_POST['idsection']) ? $_POST['idsection'] : null;
    $params['id_register'] = isset($_POST['idregistro']) ? $_POST['idregistro'] : null;
    $params['action'] = isset($_POST['accion']) ? $_POST['accion'] : null;
    $params['id'] = isset($_POST['id']) ? $_POST['id'] : null;
    if ($params['action'] == '7') {
        $params['id'] = isset($_POST['idnota']) ? $_POST['idnota'] : null;
    }
    $params['nota'] = isset($_POST['texto']) ? $_POST['texto'] : null;

    $objNota = new Notas();
    if ($params['action'] == '13') {
        $result = $objNota->insertNote($params);
    } elseif ($params['action'] == '14') {
        $result = $objNota->updateNote($params);
    } elseif ($params['action'] == '7') {
        $result = $objNota->deleteNote($params);
    }

    echo json_encode($result);
} else {
    header("Location: ../../index.php");
}