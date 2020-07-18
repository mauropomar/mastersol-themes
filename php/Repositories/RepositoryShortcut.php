<?php
require_once $_SESSION['dir_folder_php'] . 'Connection/Connection.php';

class RepositoryShortcut
{

    public function getShortcuts()
    {
        Connection::openConnection();
        $sql = "SELECT cfgapl.fn_get_shortcuts()";
        $datos = Connection::executeQuery($sql, 'column');
        Connection::closeConnection();
        return $datos;
    }

    public function deleteShortcut($params)
    {
        Connection::openConnection();
        $sqlDelete = "SELECT cfgapl.fn_delete_register(:idsection,:id_register,:id_user)";
        $result = Connection::executeQuery($sqlDelete, 'delete', $params);
        Connection::closeConnection();
        if (strpos($result, 'ERROR') === false) {
            return ['success' => true];
        } else {
            return ['success' => false, 'message' => $result];
        }
    }

}