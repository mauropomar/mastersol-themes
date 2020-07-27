<?php
require_once $_SESSION['dir_folder_php'] . 'Connection\Connection.php';

class RepositoryTables
{

    /**
     * @param $params
     * @return string
     */
    public function getTablesProperties($params)
    {
        Connection::openConnection();
        $sql = "select cfgapl.fn_get_properties(:idsection)";
        $result = Connection::executeQuery($sql, 'column', $params);
        Connection::closeConnection();
        return $result;
    }

    /**
     * @return string
     */
    public function getActions()
    {
        Connection::openConnection();
        $sql = "select cfgapl.fn_get_actions()";
        $result = Connection::executeQuery($sql, 'column');
        Connection::closeConnection();
        return $result;
    }

}