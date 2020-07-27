<?php
session_start();
if (isset($_SESSION['user'])) {
    require_once $_SESSION['dir_folder_php'] . 'Class/Register.php';
    $params['idsection'] = isset($_GET['idseccion']) ? $_GET['idseccion'] : null; //idseccion de la tabla que estoy buscando los datos
    $params['idseccionpadre'] = isset($_GET['idseccionpadre']) ? $_GET['idseccionpadre'] : null; //idseccion del padre de la tabla que estoy buscando los datos
    $params['idregister'] = isset($_GET['idproducto']) ? $_GET['idproducto'] : null; //este es el id del producto al cual le estoy buscando sus datos
    $params['idwindow'] = isset($_GET['idwindow']) ? $_GET['idwindow'] : null;
    $params['id_rol'] = $_SESSION['id_rol'];
    $objProduct = new Register();
    $result = $objProduct->getRegisters($params);
    echo !is_null($result) ? $result : json_encode([]);
} else {
    header("Location: ../../index.php");
}
