<?php
require_once $_SESSION['dir_folder_php'] . 'Repositories/RepositoryAdjuntos.php';

class Adjuntos
{
    private $repository;

    public function __construct()
    {
        $this->repository = new RepositoryAdjuntos();
    }

    public function getAdjuntos($params)
    {
        $result = $this->repository->getAdjuntos($params);
        return $result;
    }

    public function insertAdjunto($params)
    {
        $result = $this->repository->insertAdjunto($params);
        return $result;
    }

    public function deleteAdjunto($params)
    {
        $result = $this->repository->deleteAdjunto($params);
        return $result;
    }

    public function downloadAdjunto($params)
    {
        $result = $this->repository->downloadAdjunto($params);
        return $result;
    }
}