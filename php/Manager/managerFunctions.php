<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] . 'Repositories/RepositorySections.php';
    $params['name_func'] = isset($_GET['name']) ? 'btn_' . $_GET['name'] : null;
    $params['url'] = isset($_GET['url']) ? $_GET['url'] : null;
    $params['id_section'] = isset($_GET['idsection']) ? $_GET['idsection'] : null;
    $params['id_register'] = isset($_GET['id_register']) ? $_GET['id_register'] : null;
    $params['capsule'] = explode('/', $params['url'])[1] . '-';
    $objSec = new RepositorySections();
    $res = $objSec->getCapsuleSection($params);
    $params['name_class'] = 'Class_' . $res->name_section;
    $params['php_name'] = explode('/', $params['url'])[3];
    require_once $_SERVER['DOCUMENT_ROOT'] . '/MasterSol/Capsules/' . str_replace('-', '', $res->id_capsule) . '/PHP/' . str_replace('-', '_', $params['php_name']);
    $result = call_user_func_array([$params['name_class'], $params['name_func']], [$params['id_section'], $params['id_register']]);
    $data[0]['data'] = $result;
    echo json_encode($data);
    // Create and start timer firing after 2 seconds
    /*$w1 = new EvTimer(5, 2, function () {
        echo "2 seconds elapsed\n";
    });*/

} else {
    header("Location: ../../index.php");
}
