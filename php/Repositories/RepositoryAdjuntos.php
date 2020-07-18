<?php
require_once $_SESSION['dir_folder_php'] . 'Connection/Connection.php';
require_once $_SESSION['dir_folder_php'] . 'Class/Util.php';

class RepositoryAdjuntos
{
    public function getAdjuntos($params)
    {
        $result = [];
        Connection::openConnection();
        $sqlMenu = "SELECT cfgapl.fn_get_adjuntos(:id_section,:id_register,:id_user)";
        $result = Connection::executeQuery($sqlMenu, 'column', $params);
        Connection::closeConnection();
        return ['datos' => json_decode($result)];
    }


    public function insertAdjunto($params)
    {
        $result = [];
        $paramsA['id_section'] = $params['id_section'];
        $paramsA['id_register'] = $params['id_register'];
        $paramsA['id_user'] = $params['id_user'];
        $filePatch = $params['file_attach'];
        $paramsA['value_name'] = $filePatch['name'];
        unset($params);
        Connection::openConnection();
        $sqlMenu = "SELECT cfgapl.fn_insert_adjuntos(:id_section,:id_register,:id_user,:value_name)";
        $result = Connection::executeQuery($sqlMenu, 'insert', $paramsA);
        Connection::closeConnection();
        $resultA = explode("---", json_decode($result));
        $directorios = str_split(str_replace('-', '', $resultA[0] . $resultA[1]), 4);
        $directorioCreando = $resultA[2];

        if (!file_exists($directorioCreando)) { //Compruebo si el directorio raiz existe
            mkdir($directorioCreando); //Crear el directorio anterior si no existe
        }

        foreach ($directorios as $index => $value) {
            $directorioCreando .= $index = 0 ? $value : "/" . $value;
            if (!file_exists($directorioCreando)) { //Compruebo si el directorio existe
                mkdir($directorioCreando); //Crear el directorio anterior si no existe
            }
        }

        opendir($directorioCreando);
        move_uploaded_file($filePatch['tmp_name'], $directorioCreando . '/' . $filePatch['name']);

        if (strpos($result, 'ERROR') === false) {
            return ['success' => true, 'id' => $resultA[1]];
        } else {
            return ['success' => false, 'message' => $resultA[1]];
        }
    }

    public function deleteAdjunto($params)
    {
        $result = [];
        $paramsA['id_section'] = $params['id_section'];
        $paramsA['id_user'] = $params['id_user'];
        $paramsA['id_adjunto'] = $params['id_adjunto'];
        unset($params);
        Connection::openConnection();
        $sqlMenu = "SELECT cfgapl.fn_delete_adjuntos(:id_section,:id_adjunto,:id_user)";
        $result = Connection::executeQuery($sqlMenu, 'delete', $paramsA);

        if (!is_null($result)) {
            $resultA = explode('---', json_decode($result));
            $dirFile = str_split(str_replace('-', '', $resultA[0]), 4);
            $directorioDelete = $resultA[2] . '\\' . implode('\\', $dirFile);
            /*Eliminando archivo*/
            if (file_exists($directorioDelete . '\\' . $resultA[1])) {
                unlink($directorioDelete . '\\' . $resultA[1]);
            }
            /*Eliminando directorios vacíos*/
            for ($i = count($dirFile) - 1; $i > -1; $i--) {
                $archivos = @scandir($resultA[2] . '\\' . implode('\\', $dirFile));
                /*Comprobando si el directorio esta vacio o no*/
                if (count($archivos) == 2) { //Se compara con 2 ya que se ignora './' y '../'
                    $dirDel = $resultA[2] . '\\' . implode('\\', $dirFile);
                    if (is_dir($dirDel)) {
                        rmdir($dirDel);
                    }
                    unset($dirFile[$i]);
                } else {
                    break;
                }
            }
        }
        Connection::closeConnection();
        if (strpos($result, 'ERROR') === false) {
            return ['success' => true];
        } else {
            return ['success' => false];
        }
    }

    public function downloadAdjunto($params)
    {
        Connection::openConnection();
        $paramsA['id_adjunto'] = $params['id_adjunto'];
        $paramsA['id_user'] = $params['id_user'];
        $sql = "SELECT cfgapl.fn_download_adjuntos(:id_adjunto,:id_user)";
        $result = Connection::executeQuery($sql, 'column', $paramsA);
        Connection::closeConnection();
        $resultA = explode("---", json_decode($result));
        $directorio = $resultA[3] . '/' . implode('/', str_split(str_replace('-', '', $resultA[0] . $resultA[1]), 4)) . '/' . $resultA[2];
        return $directorio;
    }


}