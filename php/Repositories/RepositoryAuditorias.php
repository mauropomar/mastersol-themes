<?php
require_once $_SESSION['dir_folder_php'] . 'Connection/Connection.php';

class RepositoryAuditorias
{

    /**
     * @param $params
     * @return array
     */
    public function getAuditorias($params)
    {
        $result = [];
        Connection::openConnection();
        $sqlMenu = "SELECT security.fn_get_auditorias(:id_section,:id_register,:id_user)";
        $result = Connection::executeQuery($sqlMenu, 'column', $params);
        Connection::closeConnection();
        return ['datos' => json_decode($result)];
    }

    /**
     * @param $params
     * @return array
     */
    public function getFilterAuditorias($params)
    {
        $result = [];
        Connection::openConnection();
        //print_r("<pre>");print_r($params);die;
        $sqlMenu = "SELECT security.fn_get_filter_auditorias(:id_user,:id_properties,:id_action,:datei,:datef,:idsection,:idregister)";
        $result = Connection::executeQuery($sqlMenu, 'column', $params);
        Connection::closeConnection();
        return ['datos' => json_decode($result)];
    }
}