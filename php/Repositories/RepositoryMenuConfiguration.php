<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/MasterSol/php/Connection/Connection.php';

class RepositoryMenuConfiguration
{

    /**
     * @param $params
     * @return string
     */
    public function getMenu($params)
    {
        Connection::openConnection();
        $sqlMenu = "SELECT cfgapl.fn_get_menu_cfg(:id_rol,:id_capsules,:id_organizations,:idmenu)";
        $result = Connection::executeQuery($sqlMenu, 'column', $params);
        Connection::closeConnection();
        return $result;
    }

}