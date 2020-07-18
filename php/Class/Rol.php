<?php
require_once $_SESSION['dir_folder_php'] .'Repositories/RepositoryRol.php';

class Rol
{
    private $repository;

    public function __construct()
    {
        $this->repository = new RepositoryRol();
    }

    public function getRoles($params)
    {
        $result = $this->repository->getRoles($params);
        return $result;
    }
}