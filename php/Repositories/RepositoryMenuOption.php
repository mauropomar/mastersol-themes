<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/MasterSol/php/Connection/Connection.php';

class RepositoryMenuOption
{

    public function getMenu($params)
    {
        Connection::openConnection();
        $sqlMenu = "SELECT cfgapl.fn_get_menu(:id_rol,:id_capsules,:id_organizations,:idmenu)";
        $result = Connection::executeQuery($sqlMenu, 'column', $params);
        Connection::closeConnection();
        return $result;
    }

    public function getFilterMenu($params)
    {
        Connection::openConnection();
        $params['value_filter'] = '%' . str_replace(' ', '%', $params['value_filter']) . '%';
        $sqlMenu = "SELECT security.fn_filter_menus(:value_filter)";
        $resultQuery = Connection::executeQuery($sqlMenu, 'column', $params);
        Connection::closeConnection();
        return $resultQuery;
    }
}