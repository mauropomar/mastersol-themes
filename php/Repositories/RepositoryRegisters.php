<?php
require_once $_SESSION['dir_folder_php'] . 'Connection/Connection.php';
require_once '../Class/Util.php';
require_once '../Enum/EnumDataTypes.php';
require_once $_SESSION['dir_folder_php'] . 'Repositories/RepositorySections.php';

class RepositoryRegisters
{
    /**
     * @var RepositorySections
     */
    private $repo_sections;
    /**
     * @var EnumDataTypes
     */
    private $enum_datatype;

    /**
     * RepositoryRegisters constructor.
     */
    public function __construct()
    {
        $this->repo_sections = new RepositorySections();
        $this->enum_datatype = new EnumDataTypes();
    }

    /**
     * @param $params
     * @return string
     */
    public function getRegisters($params)
    {
        Connection::openConnection();
        $sql = "SELECT cfgapl.fn_get_registers(:idsection,:idregister,:idseccionpadre,:id_rol)";
        unset($params['idwindow']);
        $datos = Connection::executeQuery($sql, 'column', $params);
        Connection::closeConnection();
        return $datos;
    }

    /**
     * @param $params
     * @return array
     */
    public function insertRegister($params)
    {
        $columnasInsertAux = array_column($params['data'], 'field');
        $pos_id = array_search('id', $columnasInsertAux);
        unset($columnasInsertAux[$pos_id]);
        unset($params['data'][$pos_id]);
        $columnasInsertAux = array_values($columnasInsertAux);
        $columnasInsert = implode(',', $columnasInsertAux);
        $valuesInsert = "";
        foreach ($params['data'] as $index => $value) {
            if (isset($value->fk) && $value->fk) {
                if ($value->tipo == 'string') {
                    $valuesInsert .= " '" . $value->idvalor . "',";
                } elseif ($value->tipo == 'boolean') {
                    $valor = $value->idvalor ? 'true' : 'false';
                    $valuesInsert .= " " . $valor . ",";
                } elseif ($value->tipo == 'array' && $this->enum_datatype->isTypeString($value->real_name_in)) {
                    $valuesInsert .= " '{" . $value->idvalor . "}',";
                } elseif ($value->tipo == 'array' && !$this->enum_datatype->isTypeString($value->real_name_in)) {
                    $valuesInsert .= " {" . $value->idvalor . "},";
                } else {
                    $valuesInsert .= $value->idvalor . ",";
                }
            } else if (isset($value->fk) && !$value->fk) {
                if ($value->tipo == 'string') {
                    $valuesInsert .= " '" . $value->valor . "',";
                } elseif ($value->tipo == 'array' && $this->enum_datatype->isTypeString($value->real_name_in)) {
                    $valuesInsert .= " '{" . $value->valor . "}',";
                } elseif ($value->tipo == 'array' && !$this->enum_datatype->isTypeString($value->real_name_in)) {
                    $valuesInsert .= " '{" . $value->valor . "}',";
                } elseif ($value->tipo == 'string') {
                    $valuesInsert .= " '" . $value->valor . "',";
                } elseif ($value->tipo == 'boolean') {
                    $valor = $value->valor ? 'true' : 'false';
                    $valuesInsert .= $valor . ",";
                } elseif ($value->tipo == 'date') {
                    $date = date_format(date_create_from_format('d/m/Y H:i:s', $value->valor), 'Y-m-d H:i:s');
                    $valuesInsert .= "'" . $date . "',";
                } else {
                    $valuesInsert .= "'" . $value->valor . "',";
                }
            }
        }
        $valuesInsert = trim($valuesInsert, ',');
        Connection::openConnection();
        $paramsA['id_user'] = $params['id_user'];
        $paramsA['idsection'] = $params['idsection'];
        $paramsA['idpadreregistro'] = $params['idpadreregistro'] != 0 ? $params['idpadreregistro'] : null;
        $paramsA['columns'] = $columnasInsert;
        $paramsA['values'] = $valuesInsert;
        $paramsA['idsectionpadre'] = $params['idsectionpadre'] != 0 ? $params['idsectionpadre'] : null;
        unset($params['data']);
        unset($params['action']);

        $sqlInsert = "SELECT cfgapl.fn_insert_register(:idsection,:columns,:values,:idpadreregistro,:idsectionpadre,:id_user)";
        $resultQ = Connection::executeQuery($sqlInsert, 'insert', $paramsA);
        Connection::closeConnection();
        if (strpos($resultQ, 'ERROR') === false) {
            $datos = json_decode($resultQ);

            if (/*isset($datos->id_section) &&*/ isset($datos->name_table) && /*!is_null($datos->id_section) &&*/ isset($datos->namex)) {
                $params['time_event'] = $datos->name_table == 'time_event_functions' ? true : false;
                $params['id_section'] = $datos->id_section;
                $params['id'] = $datos->id;
                $params['name_section'] = $datos->name_section;
                $params['id_capsules'] = $datos->id_capsules;
                $params['name_button'] = strtolower($datos->namex);
                if ($params['time_event']) {
                    $params['identifier'] = $datos->identifier;
                }
                $resFile = $this->repo_sections->generateFilesBySection($params);
                if (!$resFile) {
                    return ['success' => false, 'message' => 'ERROR: al crear o modificar el fichero.'];
                }
            }
            return ['success' => true, 'datos' => $datos];
        } else {
            return ['success' => false, 'message' => $resultQ];
        }
    }

    /**
     * @param $params
     * @return array
     */
    public function updateRegister($params)
    {
        $valuesSet = "";
        //Util::imprimirValor($params['data']);die;
        foreach ($params['data'] as $index => $value) {
            if (isset($value->fk) && $value->fk) {
                if ($value->tipo == 'string') {
                    $valuesSet .= $value->field . " = '" . $value->idvalor . "',";
                } elseif ($value->tipo == 'boolean') {
                    $valor = $value->idvalor ? 'true' : 'false';
                    $valuesSet .= $value->field . " = " . $valor . ",";
                } elseif ($value->tipo == 'array' && $this->enum_datatype->isTypeString($value->real_name_in)) {
                    $valuesSet .= $value->field . " = '{" . $value->idvalor . "}',";
                } elseif ($value->tipo == 'array' && !$this->enum_datatype->isTypeString($value->real_name_in)) {
                    $valuesSet .= $value->field . " = {" . $value->idvalor . "},";
                } else {
                    $valuesSet .= $value->field . " = " . $value->idvalor . ",";
                }
            } else if (isset($value->fk) && !$value->fk) {
                if ($value->tipo == 'string') {
                    $valuesSet .= $value->field . " = '" . $value->valor . "',";
                } elseif ($value->tipo == 'array' && $this->enum_datatype->isTypeString($value->real_name_in)) {
                    $valuesSet .= $value->field . " = '{" . $value->valor . "}',";
                } elseif ($value->tipo == 'array' && !$this->enum_datatype->isTypeString($value->real_name_in)) {
                    $valuesSet .= $value->field . " = {" . $value->valor . "},";
                } elseif ($value->tipo == 'string') {
                    $valuesSet .= $value->field . " = '" . $value->valor . "',";
                } elseif ($value->tipo == 'boolean') {
                    $valor = $value->valor ? 'true' : 'false';
                    $valuesSet .= $value->field . " = " . $valor . ",";
                } else {
                    $valuesSet .= $value->field . " = " . $value->valor . ",";
                }
            }
        }

        $valuesSet = trim($valuesSet, ',');
        $paramsA['idsection'] = $params['idsection'];
        $paramsA['values'] = $valuesSet;
        $paramsA['idregistro'] = $params['idregistro'];
        $paramsA['id_user'] = $params['id_user'];
        unset($params);
        Connection::openConnection();
        $sqlUpdate = "SELECT cfgapl.fn_update_register(:idsection,:values,:idregistro,:id_user)";
        $resultQ = Connection::executeQuery($sqlUpdate, 'update', $paramsA);
        Connection::closeConnection();
        if (strpos($resultQ, 'ERROR') === false) {
            return ['success' => true, 'datos' => json_decode($resultQ)];
        } else {
            return ['success' => false, 'message' => $resultQ];
        }
    }

    /**
     * @param $params
     * @return array
     */
    public function deleteRegister($params)
    {
        Connection::openConnection();
        $paramsA['idsection'] = $params['idsection'];
        $paramsA['idregistro'] = "{" . implode(',', $params['idregistro']) . "}";
        $paramsA['id_user'] = $params['id_user'];
        unset($params);
        $sqlDelete = "SELECT cfgapl.fn_delete_register(:idsection,:idregistro,:id_user)";
        $result = Connection::executeQuery($sqlDelete, 'delete', $paramsA);
        Connection::closeConnection();
        $this->repo_sections->deleteFunctionBySection();
        if (strpos($result, 'ERROR') === false) {
            return ['success' => true];
        } else {
            return ['success' => false, 'message' => $result];
        }
    }

    /**
     * @param $params
     * @return string
     */
    public function getValuesForeignKey($params)
    {
        Connection::openConnection();
        $sqlGetFK = "SELECT cfgapl.fn_get_values_fk(:idsection,:idregistro,:id_rol)";
        $result = Connection::executeQuery($sqlGetFK, 'column', $params);
        Connection::closeConnection();
        return $result;
    }
}