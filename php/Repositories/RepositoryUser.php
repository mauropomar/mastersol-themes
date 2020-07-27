<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/MasterSol/php/Connection/Connection.php';

class RepositoryUser
{

    /**
     * @param $params
     * @return null
     */
    public function validatingLogin($params)
    {
        Connection::openConnection();
        $sql = "SELECT security.fn_security_login(:user, :passw)";
        $resultAux = Connection::executeQuery($sql, 'column', $params);
        if (!is_null($resultAux)) {
            $datos = json_decode($resultAux)[0];
            $result['nombre'] = $datos->nombre;
            $result['id_capsules'] = $datos->id_capsules;
            $result['id_organizations'] = $datos->id_organizations;
            $result['id_rol'] = $datos->id_rol;
            $result['id_user'] = $datos->id_user;
            Connection::closeConnection();
            return $result;
        }
        return null;
    }

    /**
     * @param $params
     * @return array
     */
    public function managerUserOption($params)
    {
        Connection::openConnection();
        $sqlMenu = "SELECT security.fn_insert_user_options(:id_capsules,:id_organizations,:id_user,:id_language,:id_rol)";
        $result = Connection::executeQuery($sqlMenu, 'column', $params);
        Connection::closeConnection();
        if (strpos($result, 'ERROR') === false) {
            return ['success' => true, 'id' => $result];
        } else {
            return ['success' => false, 'message' => $result];
        }
    }

    /**
     * @param $params
     * @return string
     */
    public function getUsers($params)
    {
        Connection::openConnection();
        $sql = "select security.fn_get_users(:id_organizations)";
        $result = Connection::executeQuery($sql, 'column', $params);
        Connection::closeConnection();
        return $result;
    }

}