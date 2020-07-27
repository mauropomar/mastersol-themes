<?php
require_once $_SESSION['dir_folder_php'] . 'Repositories/RepositoryTables.php';

class Tables
{
    /**
     * @var RepositoryTables
     */
    private $repository;

    /**
     * Tables constructor.
     */
    public function __construct()
    {
        $this->repository = new RepositoryTables();
    }

    /**
     * @param $params
     * @return string
     */
    public function getTablesProperties($params)
    {
        $result = $this->repository->getTablesProperties($params);
        return $result;
    }

    /**
     * @return string
     */
    public function getActions()
    {
        $result = $this->repository->getActions();
        return $result;
    }
}