<?php
require_once $_SESSION['dir_folder_php'] . 'Connection/Connection.php';

class Util
{
    /**
     * @var Connection
     */
    private $connection;

    /**
     * Util constructor.
     */
    public function __construct()
    {
        $this->connection = new Connection();
    }

    /**
     * @param $needle
     * @param $arr
     * @param $key_of_search
     * @param $name_of_key_to_return_value
     * @return bool|mixed
     */
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

    /**
     * @param $needle
     * @param $arr
     * @param $key_of_search
     * @param $name_of_key_to_return_value
     * @return bool
     */
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

    /**
     * @param $value
     */
    public static function imprimirValor($value)
    {
        print_r("<pre>");
        print_r($value);
    }
}