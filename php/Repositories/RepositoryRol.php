<?php
require_once $_SESSION['dir_folder_php'] .'Connection/Connection.php';

class RepositoryRol
{

    /**
     * @param $params
     * @return string
     */
    public function getRoles($params)
    {
        Connection::openConnection();
        $sql = "SELECT security.fn_get_roles(:start,:limit,:idcapsules,:idorganizations)";
        $result = Connection::executeQuery($sql, 'column', $params);
        Connection::closeConnection();
        return $result;
    }
}