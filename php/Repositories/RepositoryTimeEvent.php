<?php
require_once $_SESSION['dir_folder_php'] . 'Connection/Connection.php';
require $_SESSION['dir_folder_php'] . 'vendor/autoload.php';

class RepositoryTimeEvent
{

    public static function executeFuncPHP($val)
    {
        require_once $_SERVER['DOCUMENT_ROOT'] . '/MasterSol/Capsules/' . $val->capsule_name . '/PHP/' . $val->php_name;
        $result = call_user_func_array([$val->class_name, $val->name_func], [null, null]);
    }

    public function getTimeEvents()
    {
        Connection::openConnection();
        $sql = "SELECT cfgapl.fn_get_time_events()";
        $result = Connection::executeQuery($sql, 'column');
        Connection::closeConnection();
        return json_decode($result);
    }

    public function updateRunTimeEvents($paramsA)
    {
        var_dump($paramsA);
        die;
        Connection::openConnection();
        $sql = "SELECT cfgapl.fn_update_state_time_event(:ids)";
        $result = Connection::executeQuery($sql, 'column', $paramsA);
        Connection::closeConnection();
        var_dump($result);
        die;
    }

}