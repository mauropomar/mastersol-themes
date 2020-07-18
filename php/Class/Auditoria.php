<?php
require_once $_SESSION['dir_folder_php'] . 'Repositories/RepositoryAuditorias.php';

class Auditoria
{
    private $repository;

    public function __construct()
    {
        $this->repository = new RepositoryAuditorias();
    }

    public function getAuditorias($params)
    {
        $result = $this->repository->getAuditorias($params);
        return $result;
    }

    public function getFilterAuditorias($params)
    {
        $result = $this->repository->getFilterAuditorias($params);
        return $result;
    }
}