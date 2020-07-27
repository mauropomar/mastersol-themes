<?php
require_once $_SESSION['dir_folder_php'] .'Repositories/RepositoryRol.php';

class Rol
{
    /**
     * @var RepositoryRol
     */
    private $repository;

    /**
     * Rol constructor.
     */
    public function __construct()
    {
        $this->repository = new RepositoryRol();
    }

    /**
     * @param $params
     * @return string
     */
    public function getRoles($params)
    {
        $result = $this->repository->getRoles($params);
        return $result;
    }
}