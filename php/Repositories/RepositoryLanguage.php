<?php
require_once $_SESSION['dir_folder_php'] . 'Connection/Connection.php';

class RepositoryLanguage
{

    public function getLanguages($params)
    {
        Connection::openConnection();
        $sql = "SELECT cfgapl.fn_get_languages(:start,:limit,:idcapsules)";
        $result = Connection::executeQuery($sql, 'column', $params);
        Connection::closeConnection();
        return $result;
    }
}