<?php
require_once $_SESSION['dir_folder_php'] . 'Connection/Connection.php';

class RepositoryNotas
{

    /**
     * @param $params
     * @return array
     */
    public function insertNote($params)
    {
        $result = [];
        Connection::openConnection();
        $paramsA['id_section'] = $params['id_section'];
        $paramsA['id_register'] = $params['id_register'];
        $paramsA['nota'] = $params['nota'];
        unset($params);
        $sqlMenu = "SELECT cfgapl.fn_insert_note(:id_section,:id_register,:nota)";
        $result = Connection::executeQuery($sqlMenu, 'insert', $paramsA);
        Connection::closeConnection();
        if (strpos($result, 'ERROR') === false) {
            return ['success' => true, 'id' => $result];
        } else {
            return ['success' => false, 'message' => $result];
        }
    }

    /**
     * @param $params
     * @return array
     */
    public function updateNote($params)
    {
        $result = [];
        Connection::openConnection();
        $paramsA['id_section'] = $params['id_section'];
        $paramsA['id_register'] = $params['id_register'];
        $paramsA['nota'] = $params['nota'];
        $paramsA['id'] = $params['id'];
        unset($params);
        $sqlMenu = "SELECT cfgapl.fn_update_note(:id,:id_section,:id_register,:nota)";
        $result = Connection::executeQuery($sqlMenu, 'insert', $paramsA);
        Connection::closeConnection();
        if (strpos($result, 'ERROR') === false) {
            return ['success' => true, 'id' => $result];
        } else {
            return ['success' => false, 'message' => $result];
        }
    }

    /**
     * @param $params
     * @return array
     */
    public function deleteNote($params)
    {
        $result = [];
        Connection::openConnection();
        $paramsA['id'] = $params['id'];
        unset($params);
        $sqlMenu = "SELECT cfgapl.fn_delete_note(:id)";
        $result = Connection::executeQuery($sqlMenu, 'delete', $paramsA);
        Connection::closeConnection();
        if (strpos($result, 'ERROR') === false) {
            return ['success' => true];
        } else {
            return ['success' => false, 'message' => $result];
        }
    }

    /**
     * @param $params
     * @return array|string
     */
    public function getNotes($params)
    {
        $result = [];
        Connection::openConnection();
        $sqlMenu = "SELECT cfgapl.fn_get_notes(:id_section,:id_register)";
        $result = Connection::executeQuery($sqlMenu, 'column', $params);
        Connection::closeConnection();
        return $result;
    }

}