<?php
require_once $_SESSION['dir_folder_php'] . 'Repositories/RepositoryRegisters.php';

class Register
{
    /**
     * @var RepositoryRegisters
     */
    private $repository;

    /**
     * Register constructor.
     */
    public function __construct()
    {
        $this->repository = new RepositoryRegisters();
    }

    /**
     * @param $params
     * @return string
     */
    public function getRegisters($params)
    {
        $result = $this->repository->getRegisters($params);
        return $result;
    }

    /**
     * @param $params
     * @return array
     */
    public function insertRegister($params)
    {
        $result = $this->repository->insertRegister($params);
        return $result;
    }

    /**
     * @param $params
     * @return array
     */
    public function updateRegister($params)
    {
        $result = $this->repository->updateRegister($params);
        return $result;
    }

    /**
     * @param $params
     * @return array
     */
    public function deleteRegister($params)
    {
        $result = $this->repository->deleteRegister($params);
        return $result;
    }

    /**
     * @param $params
     * @return string
     */
    public function getValuesForeignKey($params)
    {
        $result = $this->repository->getValuesForeignKey($params);
        return $result;
    }
}