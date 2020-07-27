<?php
require_once $_SESSION['dir_folder_php'] . 'Repositories/RepositoryAdjuntos.php';

class Adjuntos
{
    /**
     * @var RepositoryAdjuntos
     */
    private $repository;

    /**
     * Adjuntos constructor.
     */
    public function __construct()
    {
        $this->repository = new RepositoryAdjuntos();
    }

    /**
     * @param $params
     * @return array
     */
    public function getAdjuntos($params)
    {
        $result = $this->repository->getAdjuntos($params);
        return $result;
    }

    /**
     * @param $params
     * @return array
     */
    public function insertAdjunto($params)
    {
        $result = $this->repository->insertAdjunto($params);
        return $result;
    }

    /**
     * @param $params
     * @return array
     */
    public function deleteAdjunto($params)
    {
        $result = $this->repository->deleteAdjunto($params);
        return $result;
    }

    /**
     * @param $params
     * @return string
     */
    public function downloadAdjunto($params)
    {
        $result = $this->repository->downloadAdjunto($params);
        return $result;
    }
}