<?php
require_once $_SESSION['dir_folder_php'] . 'Connection/Connection.php';
require_once $_SESSION['dir_folder_php'] . 'Class/Util.php';

class RepositoryFilter
{

    /**
     * @param $params
     * @return string
     */
    public function getFiltersOperators($params)
    {
        Connection::openConnection();
        $sqlUpdate = "SELECT cfgapl.fn_get_filters_operators(:idsection)";
        $result = Connection::executeQuery($sqlUpdate, 'column', $params);
        Connection::closeConnection();
        return $result;
    }

    /**
     * @param $params
     * @return string
     */
    public function getFunctionsResume($params)
    {
        Connection::openConnection();
        $sqlUpdate = "SELECT cfgapl.fn_get_functions_resume(:idsection)";
        $result = Connection::executeQuery($sqlUpdate, 'column', $params);
        Connection::closeConnection();
        return $result;
    }

    /**
     * @param $params
     * @return array
     */
    public function getResultFiltersOperators($params)
    {
        $result = [];
        Connection::openConnection();
        $params['where'] = " WHERE ";
        foreach ($params['data'] as $index => $value) {
            $operador = Util::get_value_from_array_object($value->idoperador, $value->operadores, 'id', 'nombre');
            if (isset($value->fk) && $value->fk) {
                if ($operador == 'contiene' && strrchr($value->real_name_in, 'uuid') != false) {
                    $params['where'] .= 'dat.' . $value->nombrecampo . " = " . "'" . $value->idvalor . "'" . " AND ";
                } else if ($value->tipo == 'string' && $operador == 'contiene') {
                    $params['where'] .= 'dat.' . $value->nombrecampo . " ILIKE '%" . str_replace(" ", "%", $value->idvalor) . "%' AND ";
                }
            } else if (isset($value->fk) && !$value->fk) {
                if ($value->cantparam == 2) {
                    if ($value->tipo == 'date' && $operador == 'entre' && isset($value->valor1) && isset($value->valor2)) {
                        $date = date_format(date_create_from_format('d/m/Y H:i:s', $value->valor1), 'Y-m-d') . ' 00:00:00';
                        $date1 = date_format(date_create_from_format('d/m/Y H:i:s', $value->valor2), 'Y-m-d') . ' 23:59:59';
                        $params['where'] .= 'dat.' . $value->nombrecampo . " BETWEEN '" . $date . "' AND " . "'" . $date1 . "' AND ";
                    }
                } else {
                    if ($operador == 'contiene' && strpos($value->real_name_in, 'uuid') != false) {
                        $params['where'] .= 'dat.' . $value->nombrecampo . " = '" . $value->idvalor . "' AND ";
                    } else if ($value->tipo == 'string' && $operador == 'contiene') {
                        $params['where'] .= 'dat.' . $value->nombrecampo . " ILIKE '%" . str_replace(" ", "%", $value->valor1) . "%' AND ";
                    } else if ($value->tipo == 'boolean' && $operador == '=') {
                        $valor = $value->valor1 ? 'true' : 'false';
                        $params['where'] .= 'dat.' . $value->nombrecampo . " = " . $valor . " AND ";
                    } else if ($value->tipo == 'number' && $operador == '=') {
                        $params['where'] .= 'dat.' . $value->nombrecampo . " = " . $value->valor1 . " AND ";
                    } else if ($value->tipo == 'number' && $operador == '>') {
                        $params['where'] .= 'dat.' . $value->nombrecampo . " > " . $value->valor1 . " AND ";
                    } else if ($value->tipo == 'number' && $operador == '<') {
                        $params['where'] .= 'dat.' . $value->nombrecampo . " < " . $value->valor1 . " AND ";
                    } else if ($value->tipo == 'date' && $operador == '=') {
                        $date = date_format(date_create_from_format('d/m/Y H:i:s', $value->valor1), 'Y-m-d');
                        $params['where'] .= 'dat.' . $value->nombrecampo . " ='" . $date . "' AND ";
                    } else if ($value->tipo == 'date' && $operador == '>') {
                        $date = date_format(date_create_from_format('d/m/Y H:i:s', $value->valor1), 'Y-m-d');
                        $params['where'] .= 'dat.' . $value->nombrecampo . " > '" . $date . "' AND ";
                    } else if ($value->tipo == 'date' && $operador == '<') {
                        $date = date_format(date_create_from_format('d/m/Y H:i:s', $value->valor1), 'Y-m-d');
                        $params['where'] .= 'dat.' . $value->nombrecampo . " < '" . $date . "' AND ";
                    }
                }
            }
        }
        $params['where'] = trim($params['where'], 'AND ');
        unset($params['data']);
        $sqlUpdate = "SELECT cfgapl.fn_get_result_filter_operators(:idsection,:idrol,:where)";
        $result = Connection::executeQuery($sqlUpdate, 'column', $params);
        Connection::closeConnection();
        return ['datos' => json_decode($result)];
    }

    /**
     * @param $params
     * @return array
     * @throws Exception
     */
    public function getResultFiltersFunctions($params)
    {
        $result = [];
        Connection::openConnection();
        $paramsA['fields'] = "{";
        $paramsA['funciones'] = "{";
        foreach ($params['data'] as $index => $value) {
            $paramsA['fields'] .= $value->nombrecampo . ',';
            $paramsA['funciones'] .= $value->nombrefuncion . ',';
        }
        $paramsA['fields'] = trim($paramsA['fields'], ',') . "}";
        $paramsA['funciones'] = trim($paramsA['funciones'], ',') . "}";
        $paramsA['idsection'] = $params['idsection'];
        $paramsA['idrol'] = $params['idrol'];
        $sqlUpdate = "SELECT cfgapl.fn_get_result_filter_functions(:idsection,:idrol,:fields,:funciones)";
        $result = Connection::executeQuery($sqlUpdate, 'column', $paramsA);
        $resultAux = explode(',', str_replace(['{', '}', '\\', '/', '"'], '', $result));
        Connection::closeConnection();
        if (!is_null($resultAux)) {
            foreach ($resultAux as $indexF => $value) {
                $resultado[$indexF]['dataIndex'] = $params['data'][$indexF]->nombrecampo;
                $resultado[$indexF]['funcion'] = $params['data'][$indexF]->nombrefuncion;
                if (strpos($value, '-') != false) { //if date
                    $resultado[$indexF]['valor'] = date_format(new DateTime($value), 'd/m/Y H:m:s');
                } else {
                    $resultado[$indexF]['valor'] = $value;
                }
            }
        }

        return ['datos' => !is_null($resultado) ? $resultado : null];
    }
}