<?php
require_once $_SESSION['dir_folder_php'] . 'Connection/Connection.php';
require $_SESSION['dir_folder_php'] . 'vendor/autoload.php';

use React\EventLoop\Factory;
use React\EventLoop\TimerInterface;

class RepositoryTimeEvent
{


    public static function createEvent1()
    {
        $loop = Factory::create();
        $counter = 0;

       // $ws = $loop->addPeriodicTimer(2, function () {
            Connection::openConnection();
            $sqlUpdate = "INSERT INTO public.tablex(nombre) VALUES('nombre1')";
            Connection::executeQuery($sqlUpdate, 'all');
            Connection::closeConnection();
//        });
//        $loop->run();
    }


    public static function createEvent($val)
    {
        $loop = Factory::create();
        $counter = 0;

        ${"timer_" . $val->identifier} = $loop->addPeriodicTimer($val->time, function () use ($val, /*&$counter,*/ $loop) {
            self::executeFuncPHP($val);
            //$counter++;
            /* if ($counter == 6) {
                 $loop->cancelTimer(${"timer_" . $val->identifier});
             }*/
        });

        $loop->run();
    }

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