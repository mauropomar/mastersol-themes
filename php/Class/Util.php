<?php
require_once $_SESSION['dir_folder_php'] . 'Connection/Connection.php';

class Util
{
    private $connection;

    public function __construct()
    {
        $this->connection = new Connection();
    }

    public static function get_value_from_array($needle, $arr, $key_of_search, $name_of_key_to_return_value)
    {
        if (is_array($arr)) {
            for ($i = 0; $i < sizeof($arr); $i++) {
                $row = $arr[$i];
                if ($row[$key_of_search] === $needle)
                    return $row[$name_of_key_to_return_value];
            }
        }
        return false;
    }

    public static function get_value_from_array_object($needle, $arr, $key_of_search, $name_of_key_to_return_value)
    {
        if (is_array($arr)) {
            for ($i = 0; $i < sizeof($arr); $i++) {
                $row = $arr[$i];
                if ($row->$key_of_search === $needle)
                    return $row->$name_of_key_to_return_value;
            }
        }
        return false;
    }

    public static function imprimirValor($value)
    {
        print_r("<pre>");
        print_r($value);
    }
}