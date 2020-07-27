<?php
require_once $_SESSION['dir_folder_php'] . 'Connection/Connection.php';
require_once $_SESSION['dir_folder_php'] . 'Class/Util.php';

class RepositorySections
{

    /**
     * @param $params
     * @return array|mixed
     */
    public function getSections($params)
    {
        $result = [];
        Connection::openConnection();
        $params[':idsection'] = $params['idsection'];
        $params[':id_rol'] = $params['id_rol'];
        $params[':id_user'] = $_SESSION['id_user'];
//        $params[':alerta_user'] = $_SESSION['alerta_user'];
        $sql = "SELECT cfgapl.fn_get_sections(:idsection,:id_rol,:start,:limit,:id_user)";
        $result = json_decode(Connection::executeQuery($sql, 'column', $params));
        Connection::closeConnection();
        return $result;
    }

    /**
     * @param $params
     * @return bool
     */
    public function generateFilesBySection($params)
    {

        try {
            $dirRaizCapsule = $_SERVER['DOCUMENT_ROOT'] . '/MasterSol/Capsules/';

            if (!file_exists($dirRaizCapsule)) {
                mkdir($dirRaizCapsule);
            }

            $params['dirCapsules'] = $dirRaizCapsule . str_replace('-', '', $params['id_capsules']);
            $params['dirPHP'] = $params['dirCapsules'] . '/PHP/';
            $params['dirJS'] = $params['dirCapsules'] . '/JS/';
            $params['dirImages'] = $params['dirCapsules'] . '/Images/';
            $params['nameFilePhp'] = isset($params['time_event']) && !$params['time_event'] ? 'btn_' . str_replace('-', '_', $params['id_section']) . '.php' : 'te_' . $params['identifier'] . '.php';
            $params['nameFunc'] = isset($params['time_event']) && !$params['time_event'] ? 'btn_' . strtolower($params['name_button']) : 'te_' . $params['identifier'];
            $params['dirFilePHP'] = $params['dirPHP'] . $params['nameFilePhp'];

            if (!file_exists($params['dirPHP'])) {
                mkdir($params['dirPHP'], 0, true); //Creando directorio de PHP en la capsula y seccion correspondiente
            }
            if (!file_exists($params['dirJS'])) {
                mkdir($params['dirJS'], 0, true);//Creando directorio de JS en la capsula y seccion correspondiente
            }
            if (!file_exists($params['dirImages'])) {
                mkdir($params['dirImages'], 0, true);//Creando directorio de Images en la capsula y seccion correspondiente
            }
            return self::createPhp($params);
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * @param $params
     * @return bool
     */
    private function createPhp($params)
    {
        try {
            if (isset($params['time_event']) && !$params['time_event']) {
                $comentario = "\n\n/*Start " . $params['nameFunc'] . "\n * Debe retornarse: \n* 0 - Sin acción \n* 1 - Refrescar Tupla \n* 2 - Refrescar Sección \n* Y un texto\n */\n";
            } else {
                $comentario = "\n\n/*Start " . $params['nameFunc'] . "\n * Debe retornarse: \n* 0 - Sin acción */\n";
            }
            $params['function'] = $comentario . " public static function " . $params['nameFunc'] . "(\$id_section,\$id_register)" . "\n" . "{ " . "\n" .
                " Connection::openConnection(); \n\n  Connection::closeConnection(); \n\n return 0;\n }\n /*End " . $params['nameFunc'] . "*/\n\n }";
            if (!file_exists($params['dirPHP'] . $params['nameFilePhp'])) {
                $params['requires'] = "require_once \$_SESSION['dir_folder_php'] . 'Connection/Connection.php'; \n\n";
                $params['nameClass'] = isset($params['time_event']) && !$params['time_event'] ? "class Class_" . $params['name_section'] . " {" : "class Class_" . $params['identifier'] . " {";
                //$params['atributos'] = "\n\n private \$connection;";
                //$params['constructor'] = "\n\n public function __construct()  \n{\n \$this->connection = new Connection(); \n}\n\n";
                file_put_contents($params['dirFilePHP'], "<?php \n\n" . $params['requires'], FILE_APPEND);
                file_put_contents($params['dirFilePHP'], $params['nameClass'] /*. $params['atributos'] . $params['constructor']*/, FILE_APPEND);
                file_put_contents($params['dirFilePHP'], $params['function'], FILE_APPEND);
            } else {
                /*Compruebo si la funcion no existe*/
                $cadena = file_get_contents($params['dirFilePHP']);
                if (strpos($cadena, $params['nameFunc'] . '(') === false) {
                    /*Primero eliminar el "}" de la clase y luego volver añadirlo, luego de insertar la nueva función*/
                    $filePHP = fopen($params['dirFilePHP'], 'r+');
                    ftruncate($filePHP, fstat($filePHP)['size'] - 1);
                    file_put_contents($params['dirFilePHP'], $params['function'], FILE_APPEND);
                }
            }
        } catch (Exception $e) {
            return false;
        }
        return true;
    }

    /**
     * @return bool
     */
    public function createFolderCapsulesMultiple()
    {
        Connection::openConnection();
        $sql = "SELECT cfgapl.fn_get_sections_buttons(null,null)";
        $result = json_decode(Connection::executeQuery($sql, 'column'));
        Connection::closeConnection();

        if (is_array($result) && count($result) > 0) {
            foreach ($result as $value) {
                $params['time_event'] = false;
                $params['id_section'] = $value->id_section;
                $params['id_capsules'] = $value->id_capsules;
                $params['name_button'] = $value->name;
                $params['name_section'] = $value->name_section;
                $params['name_function'] = $value->name_function;
                if (substr($value->name_function, 0, 3) == 'te_') {
                    $params['identifier'] = $value->identifier;
                    $params['time_event'] = true;
                }
                self::generateFilesBySection($params);
            }
        }

        return true;
    }

    /**
     * @param $params
     * @return bool
     */
    public function deleteFunction($params)
    {
        try {
            $dirRaizCapsule = $_SERVER['DOCUMENT_ROOT'] . '/MasterSol/Capsules/';

            $params['dirCapsules'] = $dirRaizCapsule . str_replace('-', '', $params['id_capsules']);
            $params['dirPHP'] = $params['dirCapsules'] . '/PHP/';
            $params['dirFilePHP'] = $params['dirPHP'] . $params['php_name'] . '.php';

            if (file_exists($params['dirFilePHP']) && isset($params['id_section']) && !is_null($params['id_section'])) {
                $cadena = file_get_contents($params['dirFilePHP']);
                if (strpos($cadena, $params['name_function'] . '(') !== false) {
                    $filePHP = fopen($params['dirFilePHP'], 'r+');
                    $pos_start_func = strpos($cadena, '/*Start ' . $params['name_function']);
                    $pos_end_func = strrpos($cadena, $params['name_function'] . '*/') + strlen($params['name_function'] . '*/');
                    $start_func = substr($cadena, 0, $pos_start_func);
                    $end_func = substr($cadena, $pos_end_func, fstat($filePHP)['size']);
                    file_put_contents($params['dirFilePHP'], $start_func . ' ' . $end_func);
                }

                $cadena = file_get_contents($params['dirFilePHP']);
                /*Aqui se comprueba si el archivo php contiene alguna función*/
                if (strpos($cadena, 'function') === false) {
                    unlink($params['dirFilePHP']);
                }
            } elseif (file_exists($params['dirFilePHP']) && is_null($params['id_section'])) {
                unlink($params['dirFilePHP']);
            }
        } catch (Exception $e) {
            return false;
        }
        return true;
    }

    /**
     * @return bool
     */
    public function deleteFunctionBySection()
    {
        Connection::openConnection();
        $sql = "SELECT cfgapl.fn_get_functions_deleted()";
        $result = json_decode(Connection::executeQuery($sql, 'column'));
        $deleted = [];
        if (is_array($result) && count($result) > 0) {
            foreach ($result as $value) {
                $params['id_section'] = $value->id_section;
                $params['id_capsules'] = $value->id_capsules;
                $params['name_button'] = $value->name;
                $params['name_function'] = $value->name_function;
                $params['php_name'] = $value->php_name;
                $res = self::deleteFunction($params);
                if ($res) {
                    array_push($deleted, $value->id_register);
                }
            }
        }

        if (is_array($deleted) && count($deleted) > 0) {
            $paramsA[':ids'] = "{" . implode(',', $deleted) . "}";
            $sql = "SELECT cfgapl.fn_delete_functions_deleted(:ids)";
            Connection::executeQuery($sql, 'delete', $paramsA);
        }
        Connection::closeConnection();

        return true;
    }



    /**
     * @param $params
     * @return mixed
     */
    public function getCapsuleSection($params)
    {
        $paramsA['capsule_name'] = $params['capsule'];
        $paramsA['id_section'] = $params['id_section'];
        Connection::openConnection();
        $sql = "SELECT cfgapl.fn_get_capsule_section(:capsule_name,:id_section)";
        $result = Connection::executeQuery($sql, 'column', $paramsA);
        Connection::closeConnection();
        return json_decode($result);
    }
}