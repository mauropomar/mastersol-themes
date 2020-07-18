<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] . 'Class/Adjuntos.php';
    $params['id_section'] = isset($_POST['idsection']) ? $_POST['idsection'] : null;
    $params['id_adjunto'] = isset($_POST['idadjunto']) ? $_POST['idadjunto'] : null;
    $params['id_register'] = isset($_POST['idregister']) ? $_POST['idregister'] : null;
    $params['value'] = isset($_POST['value']) ? $_POST['value'] : null;
    $params['id_user'] = isset($_SESSION['id_user']) ? $_SESSION['id_user'] : null;
    $params['action'] = isset($_POST['accion']) ? $_POST['accion'] : null;;
    $params['file_attach'] = isset($_FILES['file_adjunto']) ? $_FILES['file_adjunto'] : null;
    $objAdjunto = new Adjuntos();
    if ($params['action'] == '13') {
        $result = $objAdjunto->insertAdjunto($params);
        echo json_encode($result);
    } elseif ($params['action'] == '7') {
        $result = $objAdjunto->deleteAdjunto($params);
        echo json_encode($result);
    } elseif ($params['action'] == '15') {
        $filename = $objAdjunto->downloadAdjunto($params);

        if (file_exists($filename)) {
            header('Content-Description: File Transfer');
            header('Content-Type: application/octet-stream');
            header('Content-Disposition: attachment; filename="' . basename($filename) . '"');
            header('Expires: 0');
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            ob_clean();
            flush(); // Flush system output buffer
            readfile($filename);
            die();
        } else {
            echo 'No existe el fichero';
        }
    }

} else {
    header("Location: ../../index.php");
}
