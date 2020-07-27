<?php
session_start();
require_once $_SESSION['dir_folder_php'] . 'Repositories/RepositoryTimeEvent.php';
require_once $_SESSION['dir_folder_php'] . 'Class/Util.php';
require $_SESSION['dir_folder_php'] . 'vendor/autoload.php';

use React\EventLoop\Factory;

$objTE = new RepositoryTimeEvent();
$result = $objTE->getTimeEvents();
$params = [];
$ids = [];

//if (!is_null($result)) {
//    foreach ($result as $index => $val) {
//        Util::imprimirValor($val);
//        $val->time = $val->each_any_minutes * 5;
//        RepositoryTimeEvent::createEvent($val);
//    }
//}
//$paramsA['ids'] = "{" . implode(',', $ids) . "}";
//$objTE->updateRunTimeEvents($paramsA);
var_dump($params);

echo 'finnn';





