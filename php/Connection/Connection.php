<?php
//Connection data to the database
define('NAME_SERVER', isset($_POST['NAME_SERVER']) ? $_POST['NAME_SERVER'] : 'localhost');
define('NAME_USER', isset($_POST['NAME_USER']) ? $_POST['NAME_USER'] : 'postgres');
define('PASSWORD', isset($_POST['PASSWORD']) ? $_POST['PASSWORD'] : 'postgres');
define('NAME_DATABASE', isset($_POST['NAME_DATABASE']) ? $_POST[''] : 'mastersol');
define('PORT', isset($_POST['PORT']) ? $_POST['PORT'] : '5435');

class Connection
{
    /**
     * @var
     */
    private static $connection;

    //Open connection
    public static function openConnection()
    {
        if (!isset(self::$connection)) {
            try {
                self::$connection = new PDO('pgsql:host=' . NAME_SERVER . '; dbname=' . NAME_DATABASE . '; port=' . PORT, NAME_USER, PASSWORD);
                self::$connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                self::$connection->exec("SET NAMES 'UTF8'");
            } catch (PDOException $exception) {
                print "ERROR" . $exception->getMessage() . "<br>";
            }
        }
    }

    //Close connection
    public static function closeConnection()
    {
        if (isset(self::$connection)) {
            self::$connection = null;
        }
    }

    //Show connection
    public static function showConnection()
    {
        if (isset(self::$connection)) {
            return self::$connection;
        } else {
            return null;
        }
    }

    //Execute query

    /**
     * @param $query
     * @param string $result_type
     * @param array $params
     * @return string
     */
    public static function executeQuery($query, $result_type = 'all', $params = [])
    {
        $resultQuery = self::$connection->prepare($query . '--', array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
        $resultQuery->execute($params);
        $result = "";
        if ($result_type == 'all') {
            $result = $resultQuery->fetchAll();
        } elseif ($result_type == 'assoc') {
            $result = $resultQuery->fetch(PDO::FETCH_ASSOC);
        } elseif ($result_type == 'column') {
            $result = $resultQuery->fetch(PDO::FETCH_COLUMN);
        } elseif ($result_type == 'num') {
            $result = $resultQuery->fetch(PDO::FETCH_NUM);
        } elseif ($result_type == 'all-assoc') {
            $result = $resultQuery->fetchAll(PDO::FETCH_ASSOC);
        } elseif ($result_type == 'all-num') {
            $result = $resultQuery->fetchAll(PDO::FETCH_COLUMN);
        } elseif ($result_type == 'insert' || $result_type == 'update' || $result_type == 'delete') {
            $result = $resultQuery->fetch(PDO::FETCH_COLUMN);
        }
        return $result;
    }
}