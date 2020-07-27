<?php
require_once $_SESSION['dir_folder_php'] . 'Repositories/RepositoryAuditorias.php';

class Auditoria
{
    /**
     * @var RepositoryAuditorias
     */
    private $repository;

    /**
     * Auditoria constructor.
     */
    public function __construct()
    {
        $this->repository = new RepositoryAuditorias();
    }

    /**
     * @param $params
     * @return array
     */
    public function getAuditorias($params)
    {
        $result = $this->repository->getAuditorias($params);
        return $result;
    }

    /**
     * @param $params
     * @return array
     */
    public function getFilterAuditorias($params)
    {
        $result = $this->repository->getFilterAuditorias($params);
        return $result;
    }
}