<?php
require_once $_SESSION['dir_folder_php'] . 'Repositories/RepositoryRegisters.php';

class Register
{
    private $repository;

    public function __construct()
    {
        $this->repository = new RepositoryRegisters();
    }

    public function getRegisters($params)
    {
        $result = $this->repository->getRegisters($params);
        return $result;
    }

    public function insertRegister($params)
    {
        $result = $this->repository->insertRegister($params);
        return $result;
    }

    public function updateRegister($params)
    {
        $result = $this->repository->updateRegister($params);
        return $result;
    }

    public function deleteRegister($params)
    {
        $result = $this->repository->deleteRegister($params);
        return $result;
    }

    public function getValuesForeignKey($params)
    {
        $result = $this->repository->getValuesForeignKey($params);
        return $result;
    }
}